import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'lib/utils/dtos/pagination/pagination-query.dto';
import { Pagination, PaginationMeta } from 'lib/utils/dtos/pagination/pagination';
import { User } from 'lib/users/src/entities/user.entity';
import { CallDto } from './dtos/CallDto';
import { CallFormatError } from './error';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Call, CallsHistory } from './entities';
import { validate } from 'class-validator';
import { PermissionsService } from 'lib/permissions';

@Injectable()
export class CallsHistoryService {
  constructor(
    @InjectRepository(CallsHistory) private readonly callsHistoryRepository: Repository<CallsHistory>,
    private readonly permService: PermissionsService,
  ) {}

  async hasAuthorizationToAccess(demander: User, target: User): Promise<boolean> {
    if (!target.isDependent()) return false;
    if (await this.permService.havePermission(target.phone, demander.phone, 'calls-history:read')) {
      return true;
    }
    return false;
  }

  async createEmptyCallsHistory(phone: string) {
    const ch = this.callsHistoryRepository.create({ phone, callsHistory: [] });
    return await ch.save();
  }

  async getCallsHistory(historyTarget: string, paginationOption?: PaginationQueryDto): Promise<Pagination<Call>> {
    let history = await this.callsHistoryRepository.findOne({ where: { phone: historyTarget } });
    if (!history) {
      history = await this.createEmptyCallsHistory(historyTarget);
    }
    const calls = history.callsHistory;
    let slicedCalls: Call[] = [];
    if (paginationOption) {
      slicedCalls = calls.slice(
        (paginationOption.page - 1) * paginationOption.limit,
        paginationOption.page * paginationOption.limit,
      );
    }
    paginationOption = { page: paginationOption?.page ?? 1, limit: paginationOption?.limit ?? calls.length };

    return {
      data: slicedCalls,
      meta: PaginationMeta.from(paginationOption.page, paginationOption.limit, calls.length),
    };
  }

  private async checkCallsValidity(calls: Call[]) {
    let hasError = false;
    for (const call of calls) {
      const validationErrors = await validate(call);
      if (validationErrors.length > 0) {
        hasError = true;
        break;
      }
    }
    if (hasError) {
      throw new CallFormatError('The given set of call contains invalid calls dtos');
    }
  }

  private sortCalls(calls: CallDto[]) {
    return calls.sort((a, b) => {
      if (new Date(a.startDate) < new Date(b.startDate)) return -1;
      if (new Date(a.startDate) > new Date(b.startDate)) return 1;
      return 0;
    });
  }

  async addCalls(target: User, calls: CallDto[]) {
    let history = await this.callsHistoryRepository.findOne({ where: { phone: target.phone } });
    if (!history) {
      history = await this.createEmptyCallsHistory(target.phone);
    }
    const mappedCalls = this.sortCalls(calls).map(
      (call) =>
        new Call({
          callee: call.callee,
          caller: call.caller,
          startDate: new Date(call.startDate),
          endDate: call.endDate ? new Date(call.endDate) : undefined,
          status: call.status,
        }),
    );
    await this.checkCallsValidity(mappedCalls);
    history.callsHistory.unshift(...mappedCalls);
    await history.save();
  }
}

import { Injectable } from '@nestjs/common';
import { CallsHistoryRepository } from './calls-history.repository';
import { PaginationQueryDto } from 'lib/utils/dtos/pagination/pagination-query.dto';
import { Call } from './schema/call.schema';
import { Pagination, PaginationMeta } from 'lib/utils/dtos/pagination/pagination';
import { User } from 'lib/users/src/schema/user.schema';
import { CallDto } from './dtos/CallDto';
import { CallFormatError } from './error';

@Injectable()
export class CallsHistoryService {
  constructor(private readonly callsHistoryRepository: CallsHistoryRepository) {}

  hasAuthorizationToAccess(demander: User, target: User): boolean {
    if (!target.isDependent()) return false;
    return true;
  }

  async createEmptyCallsHistory(phone: string) {
    return await this.callsHistoryRepository.create({ phone, callsHistory: [] });
  }

  async getCallsHistory(historyTarget: string, paginationOption?: PaginationQueryDto): Promise<Pagination<Call>> {
    let history = await this.callsHistoryRepository.findOne({ phone: historyTarget });
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

  private checkCallsValidity(target: User, calls: CallDto[]) {
    const targetPhone = target.phone;
    const hasError = calls.some((call) => {
      if (call.callee === call.caller) return true;
      if (call.callee !== targetPhone && call.caller !== targetPhone) return true;
      if (new Date(call.endDate) < new Date(call.startDate)) return true;
      if (new Date(call.startDate) > new Date()) return true;
      return false;
    });
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
    let history = await this.callsHistoryRepository.findOne({ phone: target.phone });
    if (!history) {
      history = await this.createEmptyCallsHistory(target.phone);
    }
    this.checkCallsValidity(target, calls);
    const mappedCalls = this.sortCalls(calls).map((call) => new Call(call));
    history.callsHistory.unshift(...mappedCalls);
    await history.save();
  }
}

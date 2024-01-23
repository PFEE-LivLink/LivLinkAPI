import { ApiProperty } from '@nestjs/swagger';
import { CallDto } from './CallDto';
import { PaginationTemplateDto } from 'lib/utils/dtos/pagination/pagination';

export class CallDtoPagination extends PaginationTemplateDto<CallDto[]> {
  @ApiProperty({ type: [CallDto] })
  data: CallDto[] = [];
}

import { ApiProperty } from '@nestjs/swagger';
import { SuccessTemplateDto } from '../template.dto';
import { IsNumber } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class PaginationMeta {
  static from(currentPage: number, perPage: number, total: number) {
    const meta = new PaginationMeta();
    meta.current_page = currentPage;
    meta.per_page = perPage;
    meta.last_page = total === 0 ? 1 : Math.ceil(total / perPage);
    meta.total = total;
    return meta;
  }

  @Expose()
  @ApiProperty({ example: 1 })
  @IsNumber()
  total: number;

  @Expose()
  @ApiProperty({ example: 10 })
  @IsNumber()
  per_page: number;

  @Expose()
  @ApiProperty({ example: 1 })
  @IsNumber()
  current_page: number;

  @Expose()
  @ApiProperty({ example: 1 })
  @IsNumber()
  last_page: number;

  @Expose()
  @ApiProperty({ type: Number, example: 1 })
  first_page = 1;
}

export abstract class PaginationTemplateDto<T> extends SuccessTemplateDto<T> {
  @Expose()
  @ApiProperty()
  @Type(() => PaginationMeta)
  meta: PaginationMeta;
}

export interface Pagination<T> {
  data: T[];
  meta: PaginationMeta;
}

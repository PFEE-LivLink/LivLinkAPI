import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, ValidateNested } from 'class-validator';

export class SuccessTemplateDto<T> {
  constructor(data: T) {
    this.data = data;
  }

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  success: boolean = true;

  @ValidateNested()
  data: T;
}

import { IsBoolean, ValidateNested } from 'class-validator';

export class SuccessTemplateDto<T> {
  constructor(data: T) {
    this.data = data;
  }

  @IsBoolean()
  success: boolean = true;

  @ValidateNested()
  data: T;
}

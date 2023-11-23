import { Expose } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class SuccessTemplateDto<T> {
  constructor(data: T) {
    this.data = data;
  }

  @Expose()
  @ValidateNested()
  data: T;
}

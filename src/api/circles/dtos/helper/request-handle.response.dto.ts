import { ValidateNested } from 'class-validator';
import { RequestCircleDto } from './requests-circle.response.dto';
import { SuccessTemplateDto } from 'src/utils/dtos/template.dto';

export class RequestCircleHandleDto {
  constructor(accepted: boolean, request: RequestCircleDto) {
    this.message = accepted ? 'ACCEPTED' : 'REFUSED';
    this.request = request;
  }

  message: string;

  @ValidateNested()
  request: RequestCircleDto;
}

export class RequestCircleHandleResponseDto extends SuccessTemplateDto<RequestCircleHandleDto> {
  static from(accepted: boolean, request: RequestCircleDto): RequestCircleHandleResponseDto {
    return new RequestCircleHandleResponseDto(new RequestCircleHandleDto(accepted, request));
  }
}

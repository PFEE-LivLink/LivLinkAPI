import { IsString, ValidateNested } from 'class-validator';
import { RequestCircleDto } from './requests-circle.response.dto';
import { SuccessTemplateDto } from 'src/utils/dtos/template.dto';
import { ApiProperty } from '@nestjs/swagger';

export class RequestCircleHandleDto {
  constructor(accepted: boolean, request: RequestCircleDto) {
    this.message = accepted ? 'ACCEPTED' : 'REFUSED';
    this.request = request;
  }

  @ApiProperty({ type: String, enum: ['ACCEPTED', 'REFUSED'] })
  @IsString()
  message: string;

  @ApiProperty({ type: RequestCircleDto })
  @ValidateNested()
  request: RequestCircleDto;
}

export class RequestCircleHandleResponseDto extends SuccessTemplateDto<RequestCircleHandleDto> {
  static from(accepted: boolean, request: RequestCircleDto): RequestCircleHandleResponseDto {
    return new RequestCircleHandleResponseDto(new RequestCircleHandleDto(accepted, request));
  }

  @ApiProperty({ type: RequestCircleHandleDto })
  data: RequestCircleHandleDto;
}

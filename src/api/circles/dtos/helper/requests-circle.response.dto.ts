import { IsEnum } from 'class-validator';
import { SuccessTemplateDto } from 'src/utils/dtos/template.dto';
import { CircleType, circleType } from '../../schemas/circle.schema';

export class RequestCircleDto {
  static from(requestId: string, dependentId: string, circleType: CircleType): RequestCircleDto {
    return new RequestCircleDto(requestId, dependentId, circleType);
  }

  constructor(requestId: string, dependentId: string, circleType: CircleType) {
    this.request_id = requestId;
    this.dependent_id = dependentId;
    this.circle_type = circleType;
  }

  request_id: string;

  dependent_id: string;

  @IsEnum(circleType)
  circle_type: CircleType;
}

export class RequestsCircleResponseDto extends SuccessTemplateDto<RequestCircleDto[]> {}

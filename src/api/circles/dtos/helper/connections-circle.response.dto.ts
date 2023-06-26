import { IsEnum } from 'class-validator';
import { CircleType, circleType } from '../../schemas/circle.schema';
import { SuccessTemplateDto } from 'src/utils/dtos/template.dto';

export class ConnectionCircleDto {
  static from(requestId: string, circleType: CircleType): ConnectionCircleDto {
    return new ConnectionCircleDto(requestId, circleType);
  }

  constructor(dependentId: string, circleType: CircleType) {
    this.dependent_id = dependentId;
    this.circle_type = circleType;
  }

  dependent_id: string;

  @IsEnum(circleType)
  circle_type: CircleType;
}

export class ConnectionsCircleResponseDto extends SuccessTemplateDto<ConnectionCircleDto[]> {}

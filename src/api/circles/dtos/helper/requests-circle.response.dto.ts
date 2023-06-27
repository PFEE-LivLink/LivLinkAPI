import { IsEnum, IsString } from 'class-validator';
import { SuccessTemplateDto } from 'src/utils/dtos/template.dto';
import { CircleType, circleType } from '../../schemas/circle.schema';
import { ApiProperty } from '@nestjs/swagger';

export class RequestCircleDto {
  static from(requestId: string, dependentId: string, circleType: CircleType): RequestCircleDto {
    return new RequestCircleDto(requestId, dependentId, circleType);
  }

  constructor(requestId: string, dependentId: string, circleType: CircleType) {
    this.request_id = requestId;
    this.dependent_id = dependentId;
    this.circle_type = circleType;
  }

  @ApiProperty({ type: String })
  @IsString()
  request_id: string;

  @ApiProperty({ type: String })
  @IsString()
  dependent_id: string;

  @ApiProperty({ type: String, enum: circleType })
  @IsEnum(circleType)
  circle_type: CircleType;
}

export class RequestsCircleResponseDto extends SuccessTemplateDto<RequestCircleDto[]> {
  @ApiProperty({ type: [RequestCircleDto] })
  data: RequestCircleDto[];
}

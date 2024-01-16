import { IsEnum, IsString } from 'class-validator';
import { SuccessTemplateDto } from 'lib/utils/dtos/template.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CircleType, circleType } from '../../entities/circlePerson.entity';

export class RequestCircleDto {
  static from(requestId: string, dependentId: string, circleType: CircleType): RequestCircleDto {
    return new RequestCircleDto(requestId, dependentId, circleType);
  }

  constructor(requestId: string, dependentId: string, circleType: CircleType) {
    this.request_id = requestId;
    this.dependent_id = dependentId;
    this.circle_type = circleType;
  }

  @Expose()
  @ApiProperty({ type: String })
  @IsString()
  request_id: string;

  @Expose()
  @ApiProperty({ type: String })
  @IsString()
  dependent_id: string;

  @Expose()
  @ApiProperty({ type: String, enum: circleType })
  @IsEnum(circleType)
  circle_type: CircleType;
}

export class RequestsCircleResponseDto extends SuccessTemplateDto<RequestCircleDto[]> {
  @ApiProperty({ type: [RequestCircleDto] })
  declare data: RequestCircleDto[];
}

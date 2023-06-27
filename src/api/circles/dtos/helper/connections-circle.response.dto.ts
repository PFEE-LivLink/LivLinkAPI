import { IsEnum, IsString } from 'class-validator';
import { CircleType, circleType } from '../../schemas/circle.schema';
import { SuccessTemplateDto } from 'src/utils/dtos/template.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectionCircleDto {
  static from(requestId: string, circleType: CircleType): ConnectionCircleDto {
    return new ConnectionCircleDto(requestId, circleType);
  }

  constructor(dependentId: string, circleType: CircleType) {
    this.dependent_id = dependentId;
    this.circle_type = circleType;
  }

  @ApiProperty({ type: String })
  @IsString()
  dependent_id: string;

  @ApiProperty({ type: String, enum: circleType })
  @IsEnum(circleType)
  circle_type: CircleType;
}

export class ConnectionsCircleResponseDto extends SuccessTemplateDto<ConnectionCircleDto[]> {
  @ApiProperty({ type: [ConnectionCircleDto] })
  data: ConnectionCircleDto[];
}

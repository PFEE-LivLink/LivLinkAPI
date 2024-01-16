import { IsEnum, IsString } from 'class-validator';
import { SuccessTemplateDto } from 'lib/utils/dtos/template.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CircleType, circleType } from '../../entities/circlePerson.entity';

export class ConnectionCircleDto {
  static from(requestId: string, circleType: CircleType): ConnectionCircleDto {
    return new ConnectionCircleDto(requestId, circleType);
  }

  constructor(dependentId: string, circleType: CircleType) {
    this.dependent_id = dependentId;
    this.circle_type = circleType;
  }

  @Expose()
  @ApiProperty({ type: String })
  @IsString()
  dependent_id: string;

  @Expose()
  @ApiProperty({ type: String, enum: circleType })
  @IsEnum(circleType)
  circle_type: CircleType;
}

export class ConnectionsCircleResponseDto extends SuccessTemplateDto<ConnectionCircleDto[]> {
  @ApiProperty({ type: [ConnectionCircleDto] })
  declare data: ConnectionCircleDto[];
}

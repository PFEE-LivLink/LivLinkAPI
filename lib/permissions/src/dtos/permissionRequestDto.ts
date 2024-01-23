import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { CircleType, circleType } from 'lib/circles/src/entities/circlePerson.entity';

export class PermissionsRequestDto {
  @ApiProperty({ enum: circleType })
  @IsEnum(circleType)
  circle: CircleType;

  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  value?: boolean;
}

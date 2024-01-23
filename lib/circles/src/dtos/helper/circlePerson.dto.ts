import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsPhoneNumber } from 'lib/utils/validators';
import {
  CirclePerson,
  CirclePersonStatus,
  CircleType,
  circlePersonStatus,
  circleType,
} from '../../entities/circlePerson.entity';
import { IsEnum, IsString } from 'class-validator';

export class CirclePersonDto {
  static from(circlePerson: CirclePerson) {
    const dto = new CirclePersonDto();
    dto.id = circlePerson.id;
    dto.phone = circlePerson.phone;
    dto.type = circlePerson.type;
    dto.status = circlePerson.status;
    return dto;
  }

  @Expose()
  @ApiProperty({ example: '8d9f6406-26c3-43f6-ad40-bacadcd8910f' })
  @IsString()
  id: string;

  @Expose()
  @ApiProperty({ example: '+33677777777' })
  @IsPhoneNumber()
  phone: string;

  @Expose()
  @ApiProperty({ enum: circleType, example: circleType.Mid })
  @IsEnum(circleType)
  type: CircleType;

  @Expose()
  @ApiProperty({ enum: circlePersonStatus, example: circlePersonStatus.Accepted })
  @IsEnum(circlePersonStatus)
  status: CirclePersonStatus;
}

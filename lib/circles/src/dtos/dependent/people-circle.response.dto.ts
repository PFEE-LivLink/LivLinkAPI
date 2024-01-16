import { IsEnum, ValidateNested } from 'class-validator';
import { SuccessTemplateDto } from 'lib/utils/dtos/template.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CirclePersonStatus, CircleType, circlePersonStatus, circleType } from '../../entities/circlePerson.entity';

export class PersonCircleDto {
  static from(phone: string, status: CirclePersonStatus, circleType: CircleType): PersonCircleDto {
    return new PersonCircleDto(phone, status, circleType);
  }

  constructor(phone: string, status: CirclePersonStatus, circleType: CircleType) {
    this.phone = phone;
    this.status = status;
    this.type = circleType;
  }

  @Expose()
  @ApiProperty({ type: String })
  @ValidateNested()
  phone: string;

  @Expose()
  @ApiProperty({ type: String, enum: circlePersonStatus })
  @IsEnum(circlePersonStatus)
  status: CirclePersonStatus;

  @Expose()
  @ApiProperty({ type: String, enum: circleType })
  @IsEnum(circleType)
  type: CircleType;
}

export class PersonCircleResponseDto extends SuccessTemplateDto<PersonCircleDto> {
  @ApiProperty({ type: PersonCircleDto })
  declare data: PersonCircleDto;
}
export class PeopleCircleResponseDto extends SuccessTemplateDto<PersonCircleDto[]> {
  @ApiProperty({ type: [PersonCircleDto] })
  declare data: PersonCircleDto[];
}

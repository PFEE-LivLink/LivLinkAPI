import { IsBase64, IsEnum, ValidateNested } from 'class-validator';
import { SuccessTemplateDto } from 'lib/utils/dtos/template.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CircleType, circleType } from '../../schemas/circle.schema';
import { CirclePersonStatus, circlePersonStatus } from '../../schemas/circle-person.schema';
import { PersonPayloadDto } from 'lib/users/src/dtos/person-payload.dto';
import { Expose } from 'class-transformer';

export class PersonCircleDto {
  static from(
    id: string,
    person: PersonPayloadDto,
    status: CirclePersonStatus,
    circleType: CircleType,
  ): PersonCircleDto {
    return new PersonCircleDto(id, person, status, circleType);
  }

  constructor(id: string, person: PersonPayloadDto, status: CirclePersonStatus, circleType: CircleType) {
    this.id = id;
    this.person = person;
    this.status = status;
    this.circle_type = circleType;
  }

  @Expose()
  @ApiProperty({ type: String })
  @IsBase64()
  id: string;

  @Expose()
  @ApiProperty({ type: PersonPayloadDto })
  @ValidateNested()
  person: PersonPayloadDto;

  @Expose()
  @ApiProperty({ type: String, enum: circlePersonStatus })
  @IsEnum(circlePersonStatus)
  status: CirclePersonStatus;

  @Expose()
  @ApiProperty({ type: String, enum: circleType })
  @IsEnum(circleType)
  circle_type: CircleType;
}

export class PersonCircleResponseDto extends SuccessTemplateDto<PersonCircleDto> {
  @ApiProperty({ type: PersonCircleDto })
  data: PersonCircleDto;
}
export class PeopleCircleResponseDto extends SuccessTemplateDto<PersonCircleDto[]> {
  @ApiProperty({ type: [PersonCircleDto] })
  data: PersonCircleDto[];
}

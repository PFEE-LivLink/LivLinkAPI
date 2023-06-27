import { IsBase64, IsEnum, ValidateNested } from 'class-validator';
import { PersonPayloadDto } from 'src/api/user/dtos/person-payload.dto';
import { CirclePersonStatus, circlePersonStatus } from '../../schemas/circle-person.schema';
import { CircleType, circleType } from '../../schemas/circle.schema';
import { SuccessTemplateDto } from 'src/utils/dtos/template.dto';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ type: String })
  @IsBase64()
  id: string;

  @ApiProperty({ type: PersonPayloadDto })
  @ValidateNested()
  person: PersonPayloadDto;

  @ApiProperty({ type: String, enum: circlePersonStatus })
  @IsEnum(circlePersonStatus)
  status: CirclePersonStatus;

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

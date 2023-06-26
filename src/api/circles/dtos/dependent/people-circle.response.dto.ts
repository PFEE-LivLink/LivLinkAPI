import { IsBase64, IsEnum, ValidateNested } from 'class-validator';
import { PersonPayloadDto } from 'src/api/user/dtos/person-payload.dto';
import { CirclePersonStatus, circlePersonStatus } from '../../schemas/circle-person.schema';
import { CircleType, circleType } from '../../schemas/circle.schema';
import { SuccessTemplateDto } from 'src/utils/dtos/template.dto';

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

  @IsBase64()
  id: string;

  @ValidateNested()
  person: PersonPayloadDto;

  @IsEnum(circlePersonStatus)
  status: CirclePersonStatus;

  @IsEnum(circleType)
  circle_type: CircleType;
}

export class PersonCircleResponseDto extends SuccessTemplateDto<PersonCircleDto> {}
export class PeopleCircleResponseDto extends SuccessTemplateDto<PersonCircleDto[]> {}

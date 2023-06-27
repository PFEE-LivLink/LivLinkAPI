import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsEnum, ValidateIf } from 'class-validator';
import { TransformFrenchPhoneNumber } from 'src/utils/transformers/FrenchPhoneNumber.transform';
import { IsFrenchPhoneNumber } from 'src/utils/validators';

export const personStatus = {
  register: 'register',
  unknown: 'unknown',
} as const;
export type PersonStatus = (typeof personStatus)[keyof typeof personStatus];

export class PersonPayloadDto {
  static fromUnknownPerson(phone: string): PersonPayloadDto {
    const personPayload = new PersonPayloadDto();
    personPayload.type = personStatus.unknown;
    personPayload.phone = phone;
    return personPayload;
  }

  static fromRegisteredUser(userId: string): PersonPayloadDto {
    const personPayload = new PersonPayloadDto();
    personPayload.type = personStatus.register;
    personPayload.user_id = userId;
    return personPayload;
  }

  @ApiProperty({ type: String, enum: personStatus })
  @IsEnum(personStatus)
  type: PersonStatus;

  @ApiPropertyOptional({ type: String, description: `will be defined if 'type' is set to register` })
  @ValidateIf((o) => o.type === personStatus.register)
  @IsDefined()
  user_id?: string;

  @ApiPropertyOptional({ type: String, description: `will be defined if 'type' is set to unknown` })
  @ValidateIf((o) => o.type === personStatus.unknown)
  @IsDefined()
  @IsFrenchPhoneNumber()
  @TransformFrenchPhoneNumber()
  phone?: string;
}

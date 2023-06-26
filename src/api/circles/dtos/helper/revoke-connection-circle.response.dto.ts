import { ValidateNested } from 'class-validator';
import { SuccessTemplateDto } from 'src/utils/dtos/template.dto';
import { ConnectionCircleDto } from './connections-circle.response.dto';

export class RevokeConnectionCircleDto {
  constructor(connection: ConnectionCircleDto) {
    this.message = 'CONNECTION_REVOKED';
    this.connection = connection;
  }

  message: string;

  @ValidateNested()
  connection: ConnectionCircleDto;
}

export class RevokeConnectionCircleResponseDto extends SuccessTemplateDto<RevokeConnectionCircleDto> {
  static from(connection: ConnectionCircleDto): RevokeConnectionCircleResponseDto {
    return new RevokeConnectionCircleResponseDto(new RevokeConnectionCircleDto(connection));
  }
}

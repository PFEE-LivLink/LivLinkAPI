import { IsString, ValidateNested } from 'class-validator';
import { SuccessTemplateDto } from 'src/utils/dtos/template.dto';
import { ConnectionCircleDto } from './connections-circle.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class RevokeConnectionCircleDto {
  constructor(connection: ConnectionCircleDto) {
    this.message = 'CONNECTION_REVOKED';
    this.connection = connection;
  }

  @ApiProperty({ type: String, enum: ['CONNECTION_REVOKED'] })
  @IsString()
  message: string;

  @ApiProperty({ type: ConnectionCircleDto })
  @ValidateNested()
  connection: ConnectionCircleDto;
}

export class RevokeConnectionCircleResponseDto extends SuccessTemplateDto<RevokeConnectionCircleDto> {
  static from(connection: ConnectionCircleDto): RevokeConnectionCircleResponseDto {
    return new RevokeConnectionCircleResponseDto(new RevokeConnectionCircleDto(connection));
  }

  @ApiProperty({ type: RevokeConnectionCircleDto })
  data: RevokeConnectionCircleDto;
}

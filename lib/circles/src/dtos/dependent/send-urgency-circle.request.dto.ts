import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SendUrgencyCircleRequestRequestDto {
  @Expose()
  @ApiProperty({ type: String })
  phone: string;
}

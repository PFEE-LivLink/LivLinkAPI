import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'lib/utils/validators';

export class PermissionsDto {
  @ApiProperty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ type: Object })
  circle1: Record<string, boolean>;

  @ApiProperty({ type: Object })
  circle2: Record<string, boolean>;

  @ApiProperty({ type: Object })
  circle3: Record<string, boolean>;
}

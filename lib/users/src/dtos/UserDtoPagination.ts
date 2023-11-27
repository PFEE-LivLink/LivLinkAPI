import { ApiProperty } from '@nestjs/swagger';
import { PaginationTemplateDto } from 'lib/utils/dtos/pagination/pagination';
import { UserDto } from './UserDto';

export class UserDtoPagination extends PaginationTemplateDto<UserDto[]> {
  @ApiProperty({ type: [UserDto] })
  data: UserDto[];
}

import { IsEnum, IsOptional } from 'class-validator';
import { ExcludeState } from 'lib/utils/ExcludeState';
import { omit } from 'lodash';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CircleType, circleType } from '../../schemas/circle.schema';
import { circlePersonStatus, CirclePersonStatus } from '../../schemas/circle-person.schema';

export class FilterGetPeopleInMyCirclesDto {
  @Expose()
  @ApiPropertyOptional({ type: String, enum: circleType })
  @IsOptional()
  @IsEnum(circleType)
  circle_type?: CircleType;
}
export class FilterGetRequestsDto extends FilterGetPeopleInMyCirclesDto {
  @Expose()
  @ApiPropertyOptional({ type: String, enum: omit(circlePersonStatus, 'Accepted') })
  @IsOptional()
  @IsEnum(omit(circlePersonStatus, 'Accepted'))
  status?: ExcludeState<CirclePersonStatus, 'accepted'>;
}

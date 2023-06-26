import { IsEnum, IsOptional } from 'class-validator';
import { CircleType, circleType } from '../../schemas/circle.schema';
import { CirclePersonStatus, circlePersonStatus } from '../../schemas/circle-person.schema';
import { ExcludeState } from 'src/utils/ExcludeState';
import { omit } from 'lodash';

export class FilterGetPeopleInMyCirclesDto {
  @IsOptional()
  @IsEnum(circleType)
  circle_type?: CircleType;
}
export class FilterGetRequestsDto extends FilterGetPeopleInMyCirclesDto {
  @IsOptional()
  @IsEnum(omit(circlePersonStatus, 'Accepted'))
  status?: ExcludeState<CirclePersonStatus, 'accepted'>;
}

import { Controller, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from '../authentification/decorator';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Post(':dependentId/follow')
  public async followDependent(@GetUser() user: User, @Param('dependentId') dependentId: string): Promise<void> {
    await this.usersService.followDependent(user._id, dependentId);
  }

  @Post(':dependentId/unfollow')
  public async unfollowDependent(@GetUser() user: User, @Param('dependentId') dependentId: string): Promise<void> {
    await this.usersService.unfollowDependent(user._id, dependentId);
  }
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request: Express.Request = ctx.switchToHttp().getRequest();
  const user: object = (request as any).user;
  if (data != null) {
    return user[data];
  }
  console.log(user);
  return user;
});

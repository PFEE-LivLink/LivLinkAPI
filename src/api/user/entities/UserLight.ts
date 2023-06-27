import { User } from '../schemas/user.schema';

export class UserLight {
  public static fromUser(user: User): UserLight {
    return new UserLight(user);
  }

  constructor(user: User) {
    this._id = user._id;
    this.phone = user.phone;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }

  _id: string;
  phone: string;
  firstName: string;
  lastName: string;
}

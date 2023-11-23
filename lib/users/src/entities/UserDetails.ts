import { User } from '../schema/user.schema';

export class UserDetails {
  public static fromUser(user: User): UserDetails {
    return new UserDetails(user);
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

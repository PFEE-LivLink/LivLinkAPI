/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { CirclePersonStatus, circlePersonStatus } from './schemas/circle-person.schema';
import { CircleType, circleType } from './schemas/circle.schema';
import { UserCircles } from './schemas/user-circles.schema';
import { User } from 'lib/users/src/schema/user.schema';
import { CirclesRepository } from './circles.repository';
import { CirclePerson } from './entities/CirclePerson';

@Injectable()
export class CirclesService {
  private readonly logger = new Logger(CirclesService.name);
  constructor(private readonly circlesRepository: CirclesRepository) {}

  public async isInMyCircles(user: User, phone: string): Promise<boolean> {
    const personCircles = await this.circlesRepository.findPersonInUserCircles(user, phone);
    return personCircles.some((personCircle) => personCircle.isAccepted());
  }

  public async getDependentUserCircles(
    dependentUser: User,
    circleFilter?: (circleType: CircleType) => boolean,
    statusFilter?: (status: CirclePersonStatus) => boolean,
  ): Promise<CirclePerson[]> {
    if (dependentUser.isHelper()) {
      throw new ForbiddenException('Helpers cannot do have user circles');
    }
    const userCircles = await this.circlesRepository.getOrCreateDocument(dependentUser);

    const concatCirclePersons = Object.values(circleType).reduce((acc, circleType) => {
      if (!circleFilter || circleFilter(circleType as CircleType)) {
        const p = userCircles.circles[circleType].persons.map((circlePerson) =>
          CirclePerson.from(circlePerson, circleType as CircleType),
        );
        return [...acc, ...p];
      }
      return acc;
    }, []);
    if (statusFilter) {
      return concatCirclePersons.filter((circlePerson) => statusFilter(circlePerson.status));
    }
    return concatCirclePersons;
  }

  public async addPersonToCircleHandler(
    dependentUser: User,
    phone: string,
    newCircleType: CircleType,
  ): Promise<CirclePerson> {
    if (dependentUser.isHelper()) {
      throw new Error('Helpers cannot add a person to circles.');
    }

    const circlePersons = await this.circlesRepository.findPersonInUserCircles(dependentUser, phone);

    if (circlePersons.length === 0) {
      // The person is not in the user's circles yet, so we can just send a request
      const cp = await this.circlesRepository.addPersonToCircle(dependentUser, phone, newCircleType);
      return CirclePerson.from(cp, newCircleType);
    }

    if (circlePersons.length === 1) {
      const circlePerson = circlePersons[0];

      if (circlePerson.isPending() || circlePerson.isRejected()) {
        const cp = await this.circlesRepository.movePersonCircle(
          dependentUser,
          circlePerson.phone,
          circlePerson.circleType,
          newCircleType,
          circlePersonStatus.Pending,
        );
        return CirclePerson.from(cp, newCircleType);
      }

      if (circlePerson.isAccepted()) {
        const canBypassRequest = UserCircles.compareCirclesType(newCircleType, circlePerson.circleType) >= 0;

        if (canBypassRequest) {
          const cp = await this.circlesRepository.movePersonCircle(
            dependentUser,
            circlePerson.phone,
            circlePerson.circleType,
            newCircleType,
            circlePersonStatus.Accepted,
          );
          return CirclePerson.from(cp, newCircleType);
        } else {
          const cp = await this.circlesRepository.duplicatePersonCircle(
            dependentUser,
            circlePerson.phone,
            circlePerson.circleType,
            newCircleType,
          );
          return CirclePerson.from(cp, newCircleType);
        }
      }
    }

    if (circlePersons.length === 2) {
      const otherCirclePerson = circlePersons[0];
      const acceptedCirclePerson = circlePersons[1];

      if (otherCirclePerson.isAccepted() || !acceptedCirclePerson.isAccepted()) {
        this.logger.debug(`Person ${phone}, invalid circles structure:\n${JSON.stringify(circlePersons, null, 2)}`);
        throw new Error(`The person with phone ${phone} has an invalid circles structure.`);
      }

      const canBypassRequest = UserCircles.compareCirclesType(newCircleType, acceptedCirclePerson.circleType) >= 0;

      if (canBypassRequest) {
        const cp = await this.circlesRepository.movePersonCircle(
          dependentUser,
          otherCirclePerson.phone,
          otherCirclePerson.circleType,
          newCircleType,
          circlePersonStatus.Accepted,
        );

        await this.circlesRepository.removePersonCircle(
          dependentUser,
          acceptedCirclePerson.phone,
          acceptedCirclePerson.circleType,
        );

        return CirclePerson.from(cp, newCircleType);
      } else {
        const cp = await this.circlesRepository.movePersonCircle(
          dependentUser,
          otherCirclePerson.phone,
          otherCirclePerson.circleType,
          newCircleType,
          circlePersonStatus.Pending,
        );

        return CirclePerson.from(cp, newCircleType);
      }
    }

    throw new Error(`The person with phone ${phone} is in more than 2 circles.`);
  }

  private async setStatusToBeInCircle(
    helperUser: User,
    dependentUser: User,
    circleType: CircleType,
    status: CirclePersonStatus,
  ): Promise<void> {
    if (!helperUser.isHelper()) {
      throw new Error('Only helpers can change their status in a dependent circle');
    }
    let circlePersons = await this.circlesRepository.findPersonInUserCircles(dependentUser, helperUser.phone);
    circlePersons = circlePersons.filter((circlePerson) => circlePerson.circleType === circleType);
    if (circlePersons.length === 0) {
      throw new Error(`no request to be handle for the circle ${circleType}`);
    }
    if (circlePersons.length > 1) {
      throw new Error(`multiple requests to be accepted for the circle ${circleType}`); // will be a 500 error (should not happen)
    }
    await this.circlesRepository.setPersonCircleStatus(dependentUser, helperUser.phone, circleType, status);
  }

  public async acceptToBeInCircleHandler(helperUser: User, dependentUser: User, circleType: CircleType): Promise<void> {
    await this.setStatusToBeInCircle(helperUser, dependentUser, circleType, circlePersonStatus.Accepted);
  }

  public async rejectToBeInCircleHandler(helperUser: User, dependentUser: User, circleType: CircleType): Promise<void> {
    await this.setStatusToBeInCircle(helperUser, dependentUser, circleType, circlePersonStatus.Rejected);
  }
}

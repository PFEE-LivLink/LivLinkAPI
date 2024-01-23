import { faker } from '@faker-js/faker';
import { Call, CallStatus, callStatus } from '../src/entities';

export const callBasicStub = (overwrite?: Partial<Call>) => {
  const startDate = faker.date.recent({ days: 30 });

  const status = faker.string.fromCharacters(Object.values(callStatus)) as CallStatus;
  let endDate: Date | undefined;
  if (status === callStatus.Success) {
    // endDate is between 5 and 60 minutes after startDate
    endDate = new Date(startDate.getTime() + faker.number.int({ min: 5, max: 60 }) * 60 * 1000);
  }

  return new Call({
    caller: `+3361${faker.string.numeric(7)}`,
    callee: `+3362${faker.string.numeric(7)}`,
    startDate,
    endDate,
    status,
    ...overwrite,
  });
};

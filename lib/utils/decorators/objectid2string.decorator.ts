// object-id-to-string.decorator.ts

import { Transform } from 'class-transformer';

export function ObjectIdToString() {
  return Transform((value) => {
    return value.value.toString();
  });
}

import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import * as path from 'path';
import * as fs from 'fs';

const operationsDoc = {
  send_request_to_add_in_circle: {
    summary: 'Send a request to add a person in a circle',
  },
} satisfies Record<string, Partial<OperationObject>>;
type OperationKey = keyof typeof operationsDoc;

function loadOperationDescription(operationKey: OperationKey): string {
  const file = path.join(__dirname, 'samples', 'operations', `${operationKey}.md`);
  return fs.readFileSync(file, 'utf8');
}

for (const operationKey in operationsDoc) {
  const operation = operationsDoc[operationKey];
  operation.description = loadOperationDescription(operationKey as OperationKey);
}

export function getOperationDoc(operationKey: OperationKey): Partial<OperationObject> {
  return operationsDoc[operationKey];
}

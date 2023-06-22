import { Logger } from '@nestjs/common';
import { CommandFactory } from 'nest-commander';

import { CommandsModule } from './commands/commands.module';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function bootstrap() {
  const logger = new Logger('Main');

  const app = await CommandFactory.createWithoutRunning(CommandsModule, {
    logger,
    outputConfiguration: {
      outputError: (output) => {
        logger.error(output);
      },
    },
  });
  await CommandFactory.runApplication(app);
  await app.close();
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();

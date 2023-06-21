import { Command, Option } from 'nest-commander';
import { CommandRunnerWithNestLogger } from './utils/command-runner-nest-logger.interface';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/api/app.module';

export interface RunCommandOptions {
  port: number;
  env: string;
}

@Command({ name: 'run', description: 'run the API' })
export class RunCommand extends CommandRunnerWithNestLogger {
  constructor() {
    super(RunCommand.name);
  }

  async run(passedParam: string[], options: RunCommandOptions): Promise<void> {
    this.logger.log(`Launching the '${this.command.name()}' command...`);
    this.logger.debug(`Running with options: \n${JSON.stringify(options, null, 2)}`);

    const app = await NestFactory.create(AppModule.forModule(options));

    await app.listen(options.port, () => {
      this.logger.log(`Server started on port ${options.port}`);
    });
  }

  @Option({
    flags: '-p, --port <port>',
    required: false,
    env: 'PORT',
    defaultValue: '8000',
  })
  parsePort(port: string): number {
    return parseInt(port, 10);
  }

  @Option({
    flags: '-e, --env <env>',
    choices: ['dev', 'prod', 'test'],
    required: false,
    env: 'NODE_ENV',
    defaultValue: 'dev',
  })
  parseEnv(env: string): string {
    return env;
  }
}
import { Command, Option } from 'nest-commander';
import { CommandRunnerWithNestLogger } from './utils/command-runner-nest-logger.interface';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/api/app.module';
import { ValidationPipe } from '@nestjs/common';
import { generateOpenApiDocument, setupRedoc, setupSwagger } from 'lib/utils/docs';

export interface RunCommandOptions {
  port: number;
  env: string;
  jwtSecret: string;
  genDocs: boolean;
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
    app.enableCors();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true, transformOptions: { enableImplicitConversion: true } }),
    );

    if (options.genDocs) {
      await generateOpenApiDocument(app, options.env);
      await setupSwagger(app);
      await setupRedoc(app);
    }

    await app.listen(options.port, () => {
      this.logger.log(`Server started on port ${options.port} on '${options.env}' environment`);
    });
  }

  @Option({
    flags: '-p, --port [port]',
    required: false,
    env: 'PORT',
    defaultValue: '8000',
  })
  parsePort(port: string): number {
    return parseInt(port, 10);
  }

  @Option({
    flags: '-e, --env [env]',
    choices: ['dev', 'prod', 'test'],
    required: false,
    env: 'NODE_ENV',
    defaultValue: 'dev',
  })
  parseEnv(env: string): string {
    return env;
  }

  @Option({
    flags: '--jwt-secret [jwtSecret]',
    required: false,
    env: 'JWT_SECRET',
  })
  parseJwtSecret(jwtSecret: string): string {
    return jwtSecret;
  }

  @Option({
    flags: '--genDocs [boolean]',
    required: false,
    defaultValue: false,
  })
  parseGenDocs(genDoc: string): boolean {
    if (genDoc !== 'true' && genDoc !== 'false') {
      throw new Error('genDoc must be a boolean');
    }
    return JSON.parse(genDoc);
  }
}

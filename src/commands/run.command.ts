import { Command, Option } from 'nest-commander';
import { CommandRunnerWithNestLogger } from './utils/command-runner-nest-logger.interface';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/api/app.module';
import { ValidationPipe } from '@nestjs/common';
import { generateOpenApiDocument, setupRedoc, setupSwagger } from 'lib/utils/docs';
import { AppConfiguration, appConfiguration } from 'lib/config/utils-config/src';

export interface RunCommandOptions {
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

    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true, transformOptions: { enableImplicitConversion: true } }),
    );
    const appConfig = app.get<AppConfiguration>(appConfiguration.KEY);

    if (options.genDocs) {
      await generateOpenApiDocument(app, appConfig.env);
      await setupSwagger(app);
      await setupRedoc(app);
    }

    await app.listen(appConfig.port, () => {
      this.logger.log(`Server started at ${appConfig.domain} on '${appConfig.env}' environment`);
    });
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

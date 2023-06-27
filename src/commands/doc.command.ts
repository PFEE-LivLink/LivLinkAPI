import { Command, Option } from 'nest-commander';

import { CommandRunnerWithNestLogger } from './utils/command-runner-nest-logger.interface';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/api/app.module';
import { generateOpenApiDocument, saveAsJson, saveAsYaml } from 'src/docs';

type filesType = 'json' | 'yml';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DocCommandOptions {
  filename: string;
  fileType: filesType;
}

@Command({ name: 'doc', description: 'run the API' })
export class DocCommand extends CommandRunnerWithNestLogger {
  constructor() {
    super(DocCommand.name);
  }

  async run(passedParam: string[], options: DocCommandOptions): Promise<void> {
    this.logger.log(`Launching the '${this.command.name()}' command...`);
    this.logger.debug(`Running with options: \n${JSON.stringify(options, null, 2)}`);

    if (options.fileType !== 'yml' && options.fileType !== 'json') {
      throw new Error('fileType should be yml or json');
    }

    const app = await NestFactory.create(
      AppModule.forModule({
        env: 'test', // for using the memory database
        jwtSecret: 'XXXX', // we will no use tokens
      }),
    );

    await generateOpenApiDocument(app);

    if (options.fileType === 'yml') {
      saveAsYaml(options.filename);
    } else {
      saveAsJson(options.filename);
    }

    await app.close();
  }

  @Option({
    flags: '-f, --filename [filename]',
    required: false,
    defaultValue: 'openapi',
  })
  parseFilename(filename: string): string {
    return filename;
  }

  @Option({
    flags: '-t, --file-type [fileType]',
    required: false,
    choices: ['json', 'yml'],
    defaultValue: 'json',
  })
  parseFileType(fileType: string): filesType {
    return fileType as filesType;
  }
}

import { Command, Option } from 'nest-commander';

import { CommandRunnerWithNestLogger } from './utils/command-runner-nest-logger.interface';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/api/app.module';
import { generateOpenApiDocument, saveAsJson, saveAsYaml } from 'lib/utils/docs';

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

    const app = await NestFactory.create(AppModule);

    await generateOpenApiDocument(app);

    if (!options.filename) {
      options.filename = 'openapi.' + options.fileType;
    }

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

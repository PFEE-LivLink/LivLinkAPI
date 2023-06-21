import { Logger } from '@nestjs/common';
import { Command } from 'commander';
import { CommandRunner } from 'nest-commander';

export abstract class CommandRunnerWithNestLogger extends CommandRunner {
  protected readonly logger: Logger;

  constructor(className: string) {
    super();
    this.logger = new Logger(className);
  }

  public override setCommand(command: Command): this {
    this.command = command;
    this.command.configureOutput({
      outputError: (str: string) => {
        this.logger.error(str);
      },
    });
    return this;
  }
}

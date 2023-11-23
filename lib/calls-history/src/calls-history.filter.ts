import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';
import { CallFormatError, CallHistoryError } from './error';

@Catch(CallHistoryError)
export class CallsHistoryFilter implements ExceptionFilter {
  private readonly logger = new Logger(CallsHistoryFilter.name);

  catch(exception: CallHistoryError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof CallFormatError) {
      const error = new BadRequestException(exception.message);
      return response.status(error.getStatus()).json(error.getResponse());
    }

    return response.status(500).json(exception.message);
  }
}

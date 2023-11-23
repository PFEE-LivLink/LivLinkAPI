export class CallHistoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = CallHistoryError.name;
  }
}

export class CallFormatError extends CallHistoryError {
  constructor(message: string) {
    super(message);
    this.name = CallFormatError.name;
  }
}

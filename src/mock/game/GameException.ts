abstract class GameException {
  constructor(readonly message: string) {}
}
export class UnauthenticatedException extends GameException {}
export class UnknownEntryException extends GameException {}
export class UnknownWordException extends GameException {}

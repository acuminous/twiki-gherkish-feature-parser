import BaseEvent from './BaseEvent.js';

export default class ImplicitDocstringStopEvent extends BaseEvent {

  static description = 'the end of an implicit docstring';

  constructor(props = {}) {
    super({ expected: props.expected });
  }

  test(source, session) {
    this._debug(`Testing "${source.line}"`);
    return session.isProcessingImplicitDocstring() && !session.isIndented(source);
  }

  interpret(source, session) {
    session.endDocstring();
  }
}

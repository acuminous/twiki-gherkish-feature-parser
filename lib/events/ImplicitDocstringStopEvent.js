import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ImplicitDocstringStopEvent');

export default class ImplicitDocstringStopEvent extends BaseEvent {

  static description = 'the end of an implicit docstring';

  constructor(props = {}) {
    super({ expected: props.expected, debug });
  }

  test(source, session) {
    this._debug(`Testing "${source.line}"`);
    return session.isProcessingImplicitDocstring() && !session.isIndented(source);
  }

  interpret(source, session) {
    session.endDocstring();
  }
}

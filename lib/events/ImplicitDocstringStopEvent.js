import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ImplicitDocstringStopEvent');

export default class ImplicitDocstringStopEvent extends BaseEvent {

  constructor(props = {}) {
    super({ description: 'the end of an implicit docstring', expected: props.expected, debug });
  }

  test(source, session) {
    return session.isProcessingImplicitDocstring() && !session.isIndented(source);
  }

  interpret(source, session) {
    delete session.docstring;
    return {};
  }
}

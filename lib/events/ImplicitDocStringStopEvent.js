import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ImplicitDocStringStopEvent');

export default class ImplicitDocStringStopEvent extends BaseEvent {

  constructor(props = {}) {
    super({ description: 'the end of an indented docstring', expected: props.expected, debug });
  }

  test(source, session) {
    return session.isProcessingImplicitDocString() && !session.isIndented(source);
  }

  interpret(source, session) {
    delete session.docstring;
    return {};
  }
}

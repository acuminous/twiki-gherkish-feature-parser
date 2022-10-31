import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ImplicitDocStringStartEvent');

export default class ImplicitDocStringStartEvent extends BaseEvent {

  constructor(props = {}) {
    super({ description: 'the start of an implicit docstring', expected: props.expected, debug });
  }

  test(source, session) {
    return !session.isProcessingDocString() && session.isIndented(source);
  }

  interpret(source, session) {
    this._updateSession(source, session);
    return {};
  }

  _updateSession(source, session) {
    session.docstring = { indentation: source.indentation };
  }

}

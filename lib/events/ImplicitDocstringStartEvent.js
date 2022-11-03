import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ImplicitDocstringStartEvent');

export default class ImplicitDocstringStartEvent extends BaseEvent {

  constructor(props = {}) {
    super({ description: 'the start of an implicit docstring', expected: props.expected, debug });
  }

  test(source, session) {
    return !session.isProcessingDocstring() && session.isIndented(source);
  }

  interpret(source, session) {
    session.beginImplicitDocstring(source.indentation);
    return { text: session.trimDocstring(source.line) };
  }

}

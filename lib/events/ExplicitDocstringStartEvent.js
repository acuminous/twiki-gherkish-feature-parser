import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ExplicitDocstringStartEvent');

export default class ExplicitDocstringStartEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'the start of an explicit docstring', expected: props.expected, regexp: /^\s*([-"]{3,})\s*$/, debug });
  }

  test(source, session) {
    return !session.isProcessingDocstring() && super.test(source, session);
  }

  interpret(source, session) {
    const [, delimiter] = this._match(source, session);
    session.beginExplicitDocstring(delimiter, source.indentation);
  }
}

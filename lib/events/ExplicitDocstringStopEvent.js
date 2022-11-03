import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ExplicitDocstringStopEvent');

export default class ExplicitDocstringStopEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'the end of an explicit docstring', expected: props.expected, regexp: /^\s*([-"]{3,})\s*$/, debug });
  }

  test(source, session) {
    const match = this._match(source, session);
    if (!match) return false;

    const [, delimiter] = match;
    return session.isProcessingMatchingDocstring(delimiter);
  }

  interpret(source, session) {
    session.endDocstring();
  }
}

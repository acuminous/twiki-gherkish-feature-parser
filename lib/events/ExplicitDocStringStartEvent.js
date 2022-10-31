import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ExplicitDocStringStartEvent');

export default class ExplicitDocStringStartEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'the start of an explicit docstring', expected: props.expected, regexp: /^\s*([-"]{3,})\s*$/, debug });
  }

  test(source, session) {
    return !session.isProcessingDocString() && super.test(source, session);
  }

  interpret(source, session) {
    const match = this._match(source, session);
    this._updateSession(source, session, match);
    return {};
  }

  _updateSession(source, session, match) {
    session.docstring = { token: match[1], indentation: source.indentation };
  }
}

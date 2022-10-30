import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ExplicitDocStringStartEvent');

export default class ExplicitDocStringStartEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'the start of an explicit docstring', expected: props.expected, regexp: /^\s*([-"]{3,})\s*$/, debug });
  }

  interpret(source, session, state) {
    if (session.docstring) return false;

    const match = this._match(source, session);
    if (!match) return false;

    this._updateSession(source, session, match);

    return this._dispatch(state, session, { source, data: {} });
  }

  _updateSession(source, session, match) {
    session.docstring = { token: match[1], indentation: source.indentation };
  }
}

import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ExplicitDocStringStopEvent');

export default class ExplicitDocStringStopEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'the end of an explicit docstring', handlerName: 'onExplicitDocStringStop', expected: props.expected, regexp: /^\s*([-"]{3,})\s*$/, debug });
  }

  handle(source, session, state) {
    debug(`Considering "${source.line}"`);
    if (!session.docstring || !session.docstring.token) return false;

    const match = this._match(source, session);
    if (!match) return false;

    debug(`Comparing docstring token "${session.docstring.token}" to ${match[1]}`);
    if (match[1] !== session.docstring.token) return false;

    this._updateSession(session);

    return this._dispatch(state, session, { source, data: {} });
  }

  _updateSession(session) {
    delete session.docstring;
  }
}

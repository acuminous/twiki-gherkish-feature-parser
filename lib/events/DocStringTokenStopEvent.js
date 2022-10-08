import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:DocStringTokenStopEvent');

export default class DocStringTokenStopEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'the end of an explicit docstring', handlerName: 'onDocStringTokenStop', expected: props.expected, regexp: /^\s*([-"]{3,})\s*$/, debug });
  }

  handle(source, session, state) {
    debug(`Considering "${source.line}"`);
    if (!session.docString || !session.docString.token) return false;

    const match = this._match(source, session);
    if (!match) return false;

    debug(`Comparing docstring token "${session.docString.token}" with ${match[1]}`);
    if (match[1] !== session.docString.token) return false;

    this._updateSession(session);

    return this._dispatch(state, session, { source, data: {} });
  }

  _updateSession(session) {
    delete session.docString;
  }
}

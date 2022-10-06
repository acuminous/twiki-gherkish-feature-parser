import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class DocStringTokenStopEvent extends BaseRegExpEvent {

  constructor() {
    const debug = Debug('twiki:gherkish-feature-parser:events:DocStringTokenStopEvent');
    super({ description: 'The end of an explicit DocString', handlerName: 'onDocStringTokenStop', regexp: /^\s*([-"]{3,})\s*$/, debug });
  }

  handle(source, session, state) {
    this._debug(`Testing text: "${source.line}" for event: ${this._name}`);
    if (!session.docString || !session.docString.token) return false;

    const match = this._match(source, session);
    if (!match) return false;

    this._debug(`Testing session docString token: "${session.docString.token}" against ${match[1]}`);
    if (match[1] !== session.docString.token) return false;

    this._updateSession(session);

    return this._dispatch(state, session, { name: this.name, source, data: {} });
  }

  _updateSession(session) {
    delete session.docString;
  }
}

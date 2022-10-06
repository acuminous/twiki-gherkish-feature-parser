import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:DocStringTokenStartEvent');

export default class DocStringTokenStartEvent extends BaseRegExpEvent {

  constructor() {
    super({ description: 'the start of an explicit DocString', handlerName: 'onDocStringTokenStart', regexp: /^\s*([-"]{3,})\s*$/, debug });
  }

  handle(source, session, state) {
    if (session.docString) return false;

    const match = this._match(source, session);
    if (!match) return false;

    this._updateSession(source, session, match);

    return this._dispatch(state, session, { source, data: {} });
  }

  _updateSession(source, session, match) {
    session.docString = { token: match[1], indentation: source.indentation };
  }
}

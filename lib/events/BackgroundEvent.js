import Debug from 'debug';
import BaseKeywordEvent from './BaseKeywordEvent.js';

export default class BackgroundEvent extends BaseKeywordEvent {

  constructor() {
    const debug = Debug('twiki:gherkish-feature-parser:events:BackgroundEvent');
    super({ description: 'a background', handlerName: 'onBackground', keyword: 'background', debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    this._updateSession(session);

    return this._dispatch(state, session, { source, data: this._getData(match) });
  }

  _updateSession(session) {
    delete session.indentation;
  }

  _getData(match) {
    return { title: match[1].trim() };
  }
}

import Debug from 'debug';
import BaseKeywordEvent from './BaseKeywordEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:BackgroundEvent');

export default class BackgroundEvent extends BaseKeywordEvent {

  constructor(props = {}) {
    super({ description: 'a background', handlerName: 'onBackground', expected: props.expected, keyword: 'background', debug });
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

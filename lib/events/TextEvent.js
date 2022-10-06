import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class TextEvent extends BaseRegExpEvent {

  constructor() {
    const debug = Debug('twiki:gherkish-feature-parser:events:TextEvent');
    super({ description: 'Some text', handlerName: 'onText', regexp: /^(.*)$/, debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    return this._dispatch(state, session, { source, data: this._getData(match) });
  }

  _getData(match) {
    return { text: match[0] };
  }
}

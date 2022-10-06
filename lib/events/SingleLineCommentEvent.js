import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class SingleLineCommentEvent extends BaseRegExpEvent {

  constructor() {
    const debug = Debug('twiki:gherkish-feature-parser:events:SingleLineCommentEvent');
    super({ description: 'A single line comment', handlerName: 'onSingleLineComment', regexp: /^\s*#\s*(.*)/, debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    return this._dispatch(state, session, { source, data: this._getData(match) });
  }

  _getData(match) {
    return { text: match[1].trim() };
  }
}

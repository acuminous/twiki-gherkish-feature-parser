import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:BlockCommentEvent');

export default class BlockCommentEvent extends BaseRegExpEvent {

  constructor() {
    super({ description: 'a block comment', handlerName: 'onBlockComment', regexp: /^\s*#{3,}\s*(.*)/, debug });
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

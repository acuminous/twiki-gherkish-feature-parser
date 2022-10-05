import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class BlockCommentEvent extends BaseRegExpEvent {

  constructor() {
    const debug = Debug('twiki:gherkish-feature-parser:events:BlockCommentEvent');
    super({ description: 'A block comment', handlerName: 'onBlockComment', regexp: /^\s*#{3,}\s*(.*)/, debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    const data = { text: match[1].trim() };
    this._dispatch(state, session, { name: this.name, source, data });

    return true;
  }
}

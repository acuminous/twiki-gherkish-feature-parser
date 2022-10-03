import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class BlockCommentEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    const { debug = Debug('twiki:gherkish-feature-parser:events:BlockCommentEvent') } = props;
    super({ regexp: /^\s*#{3,}\s*(.*)/, debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    this._debug(`Handling event: ${this.name} in state: ${state.name}`);
    const data = { text: match[1].trim() };
    state.onBlockComment({ name: this.name, source, data }, session);

    return true;
  }
}

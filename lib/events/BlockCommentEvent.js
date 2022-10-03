import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class BlockCommentEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    const { debug = Debug('twiki:gherkish-feature-parser:events:BlockCommentEvent') } = props;
    super({ regexp: /^\s*#{3,}\s*(.*)/, debug });
  }

  notify(source, session, state, match) {
    const data = { text: match[1].trim() };
    state.onBlockComment({ name: this.name, source, data }, session);
  }
}

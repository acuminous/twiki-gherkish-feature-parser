import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class MultiLineCommentEvent extends BaseRegExpEvent {
  constructor(props = {}) {
    const { debug = Debug('yadda:gherkish:events:MultiLineCommentEvent') } = props;

    super({ regexp: /^\s*#{3,}\s*(.*)/, debug });
  }

  notify(source, session, state, match) {
    const data = { text: match[1].trim() };
    state.onMultiLineComment({ name: this.name, source, data }, session);
  }
}

import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class SingleLineCommentEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    const { debug = Debug('twiki:gherkish-feature-parser:events:SingleLineCommentEvent') } = props;
    super({ regexp: /^\s*#\s*(.*)/, debug });
  }

  notify(source, session, state, match) {
    const data = { text: match[1].trim() };
    state.onSingleLineComment({ name: this.name, source, data }, session);
  }
}

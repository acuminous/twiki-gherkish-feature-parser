import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class SingleLineCommentEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    const { debug = Debug('twiki:gherkish-feature-parser:events:SingleLineCommentEvent') } = props;
    super({ regexp: /^\s*#\s*(.*)/, debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    this._debug(`Handling event: ${this.name} in state: ${state.name}`);
    const data = { text: match[1].trim() };
    state.onSingleLineComment({ name: this.name, source, data }, session);

    return true;
  }

  describe() {
    return 'A single line comment';
  }
}

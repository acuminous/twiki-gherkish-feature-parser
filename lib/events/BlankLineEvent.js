import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class BlankLineEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    const { debug = Debug('twiki:gherkish-feature-parser:events:BlankLineEvent') } = props;
    super({ regexp: /^\s*$/, debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    this._debug(`Handling event: ${this.name} in state: ${state.name}`);
    state.onBlankLine({ name: this.name, source, data: {} }, session);

    return true;
  }

  describe() {
    return 'A blank line';
  }
}

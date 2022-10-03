import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class EndEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    const { debug = Debug('twiki:gherkish-feature-parser:events:EndEvent') } = props;
    super({ regexp: /^\u0000$/, debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    this._debug(`Handling event: ${this.name} in state: ${state.name}`);
    state.onEnd({ name: this.name, source, data: {} }, session);

    return true;
  }
}

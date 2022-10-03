import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class TextEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    const { debug = Debug('twiki:gherkish-feature-parser:events:TextEvent') } = props;
    super({ regexp: /^(.*)$/, debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    this._debug(`Handling event: ${this.name} in state: ${state.name}`);
    const data = { text: match[0] };
    state.onText({ name: this.name, source, data }, session);

    return true;
  }
}

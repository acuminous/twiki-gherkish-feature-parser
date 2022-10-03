import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class StepEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    const { debug = Debug('twiki:gherkish-feature-parser:events:StepEvent') } = props;
    super({ regexp: /^(.*)$/, debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    this._debug(`Handling event: ${this.name} in state: ${state.name}`);
    const data = { text: match[0].trim() };
    session.indentation = source.indentation;
    state.onStep({ name: this.name, source, data }, session);

    return true;
  }

  describe() {
    return 'A step';
  }
}

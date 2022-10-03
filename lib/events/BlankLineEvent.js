import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class BlankLineEvent extends BaseRegExpEvent {
  constructor(props = {}) {
    const { debug = Debug('twiki-bdd:gherkish-feature-parser:events:BlankLineEvent') } = props;

    super({ regexp: /^\s*$/, debug });
  }

  notify(source, session, state) {
    state.onBlankLine({ name: this.name, source, data: {} }, session);
  }
}

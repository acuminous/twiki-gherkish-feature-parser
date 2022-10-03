import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class TextEvent extends BaseRegExpEvent {
  constructor(props = {}) {
    const { debug = Debug('twiki-bdd:gherkish-feature-parser:events:TextEvent') } = props;

    super({ regexp: /^(.*)$/, debug });
  }

  notify(source, session, state, match) {
    const data = { text: match[0] };
    state.onText({ name: this.name, source, data }, session);
  }
}

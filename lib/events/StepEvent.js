import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class StepEvent extends BaseRegExpEvent {
  constructor(props = {}) {
    const { debug = Debug('twiki-bdd:gherkish-feature-parser:events:StepEvent') } = props;

    super({ regexp: /^(.*)$/, debug });
  }

  notify(source, session, state, match) {
    const data = { text: match[0].trim() };
    session.indentation = source.indentation;
    state.onStep({ name: this.name, source, data }, session);
  }
}

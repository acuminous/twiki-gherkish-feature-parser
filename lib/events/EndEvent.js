import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class EndEvent extends BaseRegExpEvent {
  constructor(props = {}) {
    const { debug = Debug('yadda:gherkish:events:EndEvent') } = props;

    super({ regexp: /^\u0000$/, debug });
  }

  notify(source, session, state) {
    state.onEnd({ name: this.name, source, data: {} }, session);
  }
};

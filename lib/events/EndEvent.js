import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:EndEvent');

export default class EndEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'the end of the feature', handlerName: 'onEnd', expected: props.expected, regexp: /^\u0000$/, debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    return this._dispatch(state, session, { source, data: {} });
  }
}

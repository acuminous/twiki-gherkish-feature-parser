import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:BlankLineEvent');

export default class BlankLineEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'a blank line', handlerName: 'onBlankLine', expected: props.expected, regexp: /^\s*$/, debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    return this._dispatch(state, session, { source, data: {} });
  }
}

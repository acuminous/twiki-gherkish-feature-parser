import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class BlankLineEvent extends BaseRegExpEvent {

  constructor() {
    const debug = Debug('twiki:gherkish-feature-parser:events:BlankLineEvent');
    super({ description: 'A blank line', handlerName: 'onBlankLine', regexp: /^\s*$/, debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    return this._dispatch(state, session, { name: this.name, source, data: {} });
  }
}

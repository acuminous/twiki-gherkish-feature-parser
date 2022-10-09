import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:TextEvent');

export default class TextEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'some text', expected: props.expected, regexp: /^(.*)$/, debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    return this._dispatch(state, session, { source, data: this._getData(match) });
  }

  _getData(match) {
    return { text: match[0] };
  }
}

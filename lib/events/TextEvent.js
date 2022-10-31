import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:TextEvent');

export default class TextEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'some text', expected: props.expected, regexp: /^(.*)$/, debug });
  }

  interpret(source, session) {
    const match = this._match(source, session);
    return this._getData(match);
  }

  _getData(match) {
    return { text: match[0] };
  }
}

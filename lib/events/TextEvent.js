import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:TextEvent');

export default class TextEvent extends BaseRegExpEvent {

  static description = 'some text';

  constructor(props = {}) {
    super({ expected: props.expected, regexp: /^(.*)$/, debug });
  }

  interpret(source, session) {
    return this.#getData(source, session);
  }

  #getData(source, session) {
    const match = this._match(source, session);
    return { text: match[0].trim() };
  }
}

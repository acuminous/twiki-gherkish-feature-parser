import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class TextEvent extends BaseRegExpEvent {

  static description = 'some text';

  constructor(props = {}) {
    super({ expected: props.expected, regexp: /^(.*)$/ });
  }

  interpret(source, session) {
    return this.#getData(source, session);
  }

  #getData(source, session) {
    const match = this._match(source, session);
    return { text: match[0].trim() };
  }
}

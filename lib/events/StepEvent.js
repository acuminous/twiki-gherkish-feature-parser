import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class StepEvent extends BaseRegExpEvent {

  static description = 'a step';

  constructor(props = {}) {
    super({ expected: props.expected, regexp: /^(.*)$/ });
  }

  interpret(source, session) {
    session.indent(source.indentation);
    return this.#getData(source, session);
  }

  #getData(source, session) {
    const [text] = this._match(source, session);
    return { text: text.trim() };
  }
}

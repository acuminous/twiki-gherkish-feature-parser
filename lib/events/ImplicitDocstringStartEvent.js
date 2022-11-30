import BaseEvent from './BaseEvent.js';

export default class ImplicitDocstringStartEvent extends BaseEvent {

  static description = 'the start of an implicit docstring';

  constructor(props = {}) {
    super({ expected: props.expected });
  }

  test(source, session) {
    this._debug(`Testing "${source.line}"`);
    return !session.isProcessingDocstring() && session.isIndented(source);
  }

  interpret(source, session) {
    session.beginImplicitDocstring(source.indentation);
    return this.#getData(source, session);
  }

  #getData(source, session) {
    return { text: session.trimDocstring(source.line) };
  }

}

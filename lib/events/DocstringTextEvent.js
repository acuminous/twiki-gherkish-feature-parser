import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:DocstringTextEvent');

export default class DocstringTextEvent extends BaseEvent {

  static description = 'a docstring line';

  constructor(props = {}) {
    super({ expected: props.expected, debug });
  }

  test(source, session) {
    this._debug(`Testing "${source.line}"`);
    return session.isProcessingDocstring();
  }

  interpret(source, session) {
    return this.#getData(source, session);
  }

  #getData(source, session) {
    return { text: session.trimDocstring(source.line) };
  }
}

import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ImplicitDocstringStartEvent');

export default class ImplicitDocstringStartEvent extends BaseEvent {

  static description = 'the start of an implicit docstring';

  constructor(props = {}) {
    super({ expected: props.expected, debug });
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

import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:DocstringTextEvent');

export default class DocstringTextEvent extends BaseEvent {

  constructor(props = {}) {
    super({ description: 'a docstring line', expected: props.expected, debug });
  }

  test(source, session) {
    return session.isProcessingDocstring();
  }

  interpret(source, session) {
    return this._getData(source, session);
  }

  _getData(source, session) {
    return { text: session.trimDocstring(source.line) };
  }
}

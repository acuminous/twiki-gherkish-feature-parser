import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:DocStringTextEvent');

export default class DocStringTextEvent extends BaseEvent {

  constructor(props = {}) {
    super({ description: 'a docstring line', expected: props.expected, debug });
  }

  test(source, session) {
    const isProcessingDocString = session.isProcessingDocString();
    debug(`Checking if session is already processing a docstring: ${isProcessingDocString}`);
    return isProcessingDocString;
  }

  interpret(source, session) {
    return this._getData(source, session);
  }

  _getData(source, session) {
    return { text: source.line.substr(session.docstring.indentation) };
  }
}

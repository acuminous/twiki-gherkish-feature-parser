import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ImplicitDocstringStopEvent');

export default class ImplicitDocstringStopEvent extends BaseEvent {

  constructor(props = {}) {
    super({ description: 'the end of an indented docstring', expected: props.expected, debug });
  }

  test(source, session) {
    const isProcessingImplicitDocstring = session.isProcessingImplicitDocstring();
    debug(`Checking if session is processing an implicit docstring: ${isProcessingImplicitDocstring}`);
    if (!isProcessingImplicitDocstring) return false;

    const isIndented = session.isIndented(source);
    debug(`Checking if "${source.line}" is indented: ${isIndented}`);
    return !isIndented;
  }

  interpret(source, session) {
    delete session.docstring;
    return {};
  }
}

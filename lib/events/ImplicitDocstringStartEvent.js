import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ImplicitDocstringStartEvent');

export default class ImplicitDocstringStartEvent extends BaseEvent {

  constructor(props = {}) {
    super({ description: 'the start of an implicit docstring', expected: props.expected, debug });
  }

  test(source, session) {
    const isProcessingDocstring = session.isProcessingDocstring();
    debug(`Checking if session is already processing a docstring: ${isProcessingDocstring}`);
    if (isProcessingDocstring) return false;

    const isIndented = session.isIndented(source);
    debug(`Checking if "${source.line}" is indented: ${isIndented}`);
    return isIndented;
  }

  interpret(source, session) {
    this._updateSession(source, session);
    return this._getData(source, session);
  }

  _updateSession(source, session) {
    session.docstring = { indentation: source.indentation };
  }

  _getData(source, session) {
    return { text: source.line.substr(session.docstring.indentation) };
  }

}

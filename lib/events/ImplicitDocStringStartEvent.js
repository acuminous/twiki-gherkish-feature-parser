import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ImplicitDocStringStartEvent');

export default class ImplicitDocStringStartEvent extends BaseEvent {

  constructor(props = {}) {
    super({ description: 'the start of an implicit docstring', expected: props.expected, debug });
  }

  test(source, session) {
    debug('Testing whether session is already processing a docstring');
    if (session.isProcessingDocString()) return false;

    debug(`Testing whether "${source.line}" is indented`);
    if (!session.isIndented(source)) return false;

    return true;
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

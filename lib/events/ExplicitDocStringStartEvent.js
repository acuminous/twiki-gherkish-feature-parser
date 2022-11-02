import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ExplicitDocStringStartEvent');

export default class ExplicitDocStringStartEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    super({ description: 'the start of an explicit docstring', expected: props.expected, regexp: /^\s*([-"]{3,})\s*$/, debug });
  }

  test(source, session) {
    const isProcessingDocString = session.isProcessingDocString();
    debug(`Checking if session is already processing a docstring: ${isProcessingDocString}`);
    if (isProcessingDocString) return false;

    return super.test(source, session);
  }

  interpret(source, session) {
    const match = this._match(source, session);
    this._updateSession(source, session, match);
    return {};
  }

  _updateSession(source, session, match) {
    session.docstring = { token: match[1], indentation: source.indentation };
  }
}

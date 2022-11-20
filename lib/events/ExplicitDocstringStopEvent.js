import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ExplicitDocstringStopEvent');

export default class ExplicitDocstringStopEvent extends BaseRegExpEvent {

  static description = 'the end of an explicit docstring';

  constructor(props = {}) {
    super({ expected: props.expected, regexp: /^\s*([-"]{3,})\s*$/, debug });
  }

  test(source, session) {
    const delimiter = this._getDelimiter(source, session);
    return session.isProcessingMatchingDocstring(delimiter);
  }

  interpret(source, session) {
    session.endDocstring();
  }

  _getDelimiter(source, session) {
    const [, delimiter] = this._match(source, session) || [];
    return delimiter;
  }
}

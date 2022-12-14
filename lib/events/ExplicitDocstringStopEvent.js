import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class ExplicitDocstringStopEvent extends BaseRegExpEvent {

  static description = 'the end of an explicit docstring';

  constructor(props = {}) {
    super({ expected: props.expected, regexp: /^\s*([-"]{3,})\s*$/ });
  }

  test(source, session) {
    const delimiter = this.#getDelimiter(source, session);
    return session.isProcessingMatchingDocstring(delimiter);
  }

  interpret(source, session) {
    session.endDocstring();
  }

  #getDelimiter(source, session) {
    const [, delimiter] = this._match(source, session) || [];
    return delimiter;
  }
}

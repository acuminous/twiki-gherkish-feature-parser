import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class ExplicitDocstringStartEvent extends BaseRegExpEvent {

  static description = 'the start of an explicit docstring';

  constructor(props = {}) {
    super({ expected: props.expected, regexp: /^\s*([-"]{3,})\s*$/ });
  }

  test(source, session) {
    return !session.isProcessingDocstring() && super.test(source, session);
  }

  interpret(source, session) {
    const delimiter = this.#getDelimiter(source, session);
    session.beginExplicitDocstring(delimiter, source.indentation);
  }

  #getDelimiter(source, session) {
    const [, delimiter] = this._match(source, session) || [];
    return delimiter;
  }
}

import BaseKeywordEvent from './BaseKeywordEvent.js';

export default class BackgroundEvent extends BaseKeywordEvent {

  static description = 'a background';

  constructor(props = {}) {
    super({ expected: props.expected, keyword: 'background' });
  }

  interpret(source, session) {
    session.clearIndentation();
    return this.#getData(source, session);
  }

  #getData(source, session) {
    const [, title] = this._match(source, session);
    return { title: title.trim() };
  }
}

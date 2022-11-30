import BaseKeywordEvent from './BaseKeywordEvent.js';

export default class FeatureEvent extends BaseKeywordEvent {

  static description = 'a feature';

  constructor(props = {}) {
    super({ expected: props.expected, keyword: 'feature' });
  }

  interpret(source, session) {
    return this.#getData(source, session);
  }

  #getData(source, session) {
    const [, title] = this._match(source, session);
    return { title: title.trim() };
  }
}

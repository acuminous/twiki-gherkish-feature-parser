import BaseKeywordEvent from './BaseKeywordEvent.js';

export default class RuleEvent extends BaseKeywordEvent {

  static description = 'a rule';

  constructor(props = {}) {
    super({ expected: props.expected, keyword: 'rule' });
  }

  interpret(source, session) {
    return this.#getData(source, session);
  }

  #getData(source, session) {
    const [, title] = this._match(source, session);
    return { title: title.trim() };
  }
}

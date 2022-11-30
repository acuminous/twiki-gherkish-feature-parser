import BaseKeywordEvent from './BaseKeywordEvent.js';

export default class ScenarioEvent extends BaseKeywordEvent {

  static description = 'a scenario';

  constructor(props = {}) {
    super({ expected: props.expected, keyword: 'scenario' });
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

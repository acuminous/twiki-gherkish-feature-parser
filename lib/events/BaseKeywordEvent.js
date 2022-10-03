import BaseEvent from './BaseEvent.js';

export default class BaseKeywordEvent extends BaseEvent {

  constructor({ keyword, debug }) {
    super({ debug });
    this._keyword = keyword;
  }

  _match(source, session) {
    const regexp = session.language.regexp(this._keyword);
    this._debug(`Testing text: "${source.line}" for event: ${this.name} using regexp: ${regexp}`);
    return regexp.exec(source.line);
  }
}

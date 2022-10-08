import BaseEvent from './BaseEvent.js';

export default class BaseKeywordEvent extends BaseEvent {

  constructor({ description, handlerName, expected, keyword, debug }) {
    super({ description, handlerName, expected, debug });
    this._keyword = keyword;
  }

  _match(source, session) {
    const regexp = session.language.regexp(this._keyword);
    this._debug(`Matching "${source.line}" using ${regexp}`);
    return regexp.exec(source.line);
  }
}

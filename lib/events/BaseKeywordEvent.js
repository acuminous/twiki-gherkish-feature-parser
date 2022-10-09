import BaseEvent from './BaseEvent.js';

export default class BaseKeywordEvent extends BaseEvent {

  constructor({ description, expected, keyword, debug }) {
    super({ description, expected, debug });
    this._keyword = keyword;
  }

  _match(source, session) {
    const regexp = session.language.translate(this._keyword);
    this._debug(`Matching "${source.line}" using ${regexp}`);
    return regexp.exec(source.line);
  }
}

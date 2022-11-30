import BaseEvent from './BaseEvent.js';

export default class BaseKeywordEvent extends BaseEvent {

  #keyword;

  constructor({ expected, keyword, debug }) {
    super({ expected, debug });
    this.#keyword = keyword;
  }

  test(source, session) {
    const regexp = session.language.translate(this.#keyword);
    const result = regexp.test(source.line);
    this._debug(`Testing "${source.line}" using ${regexp}: ${result}`);
    return result;
  }

  _match(source, session) {
    const regexp = session.language.translate(this.#keyword);
    const result = regexp.exec(source.line);
    this._debug(`Matching "${source.line}" using ${regexp}: ${Boolean(result)}`);
    return result;
  }
}

import BaseEvent from './BaseEvent.js';

export default class BaseRegExpEvent extends BaseEvent {

  #regexp;

  constructor({ expected, regexp, debug }) {
    super({ expected, debug });
    this.#regexp = regexp;
  }

  test(source) {
    const result = this.#regexp.test(source.line);
    this._debug(`Testing "${source.line}" using ${this.#regexp}: ${result}`);
    return result;
  }

  _match(source) {
    const result = this.#regexp.exec(source.line);
    this._debug(`Matching "${source.line}" using ${this.#regexp}: ${Boolean(result)}`);
    return result;
  }
}

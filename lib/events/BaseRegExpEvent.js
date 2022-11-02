import BaseEvent from './BaseEvent.js';

export default class BaseRegExpEvent extends BaseEvent {

  constructor({ description, expected, regexp, debug }) {
    super({ description, expected, debug });
    this._regexp = regexp;
  }

  test(source) {
    const result = this._regexp.test(source.line);
    this._debug(`Testing "${source.line}" using ${this._regexp}: ${result}`);
    return result;
  }

  _match(source) {
    const result = this._regexp.exec(source.line);
    this._debug(`Matching "${source.line}" using ${this._regexp}: ${Boolean(result)}`);
    return result;
  }
}

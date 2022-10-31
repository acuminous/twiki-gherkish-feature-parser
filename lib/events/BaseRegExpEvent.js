import BaseEvent from './BaseEvent.js';

export default class BaseRegExpEvent extends BaseEvent {

  constructor({ description, expected, regexp, debug }) {
    super({ description, expected, debug });
    this._regexp = regexp;
  }

  test(source) {
    this._debug(`Testing "${source.line}" using ${this._regexp}`);
    return this._regexp.test(source.line);
  }

  _match(source) {
    this._debug(`Matching "${source.line}" using ${this._regexp}`);
    return this._regexp.exec(source.line);
  }
}

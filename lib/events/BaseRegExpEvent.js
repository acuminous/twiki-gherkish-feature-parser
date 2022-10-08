import BaseEvent from './BaseEvent.js';

export default class BaseRegExpEvent extends BaseEvent {

  constructor({ description, handlerName, expected, regexp, debug }) {
    super({ description, handlerName, expected, debug });
    this._regexp = regexp;
  }

  _match(source) {
    this._debug(`Matching "${source.line}" using ${this._regexp}`);
    return this._regexp.exec(source.line);
  }
}

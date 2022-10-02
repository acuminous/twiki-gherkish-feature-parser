import BaseEvent from './BaseEvent.js';

export default class BaseRegExpEvent extends BaseEvent {
  constructor({ regexp, debug }) {
    super({ debug });
    this._regexp = regexp;
  }

  _match(source) {
    this._debug(`Testing text: "${source.line}" against for event: ${this._name} using regexp: ${this._regexp}`);
    return this._regexp.exec(source.line);
  }
};

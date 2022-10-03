export default class BaseEvent {

  constructor({ debug }) {
    this._name = this.constructor.name;
    this._debug = debug;
  }

  get name() {
    return this._name;
  }
}

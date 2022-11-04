export default class BaseEvent {

  constructor({ description, expected = false, debug }) {
    this._name = this.constructor.name;
    this._description = description;
    this._expected = expected;
    this._debug = debug;
  }

  static get _handlerName() {
    return `on${this.name.replace(/Event$/, '')}`;
  }

  static defineEventHandler(state, handler) {
    if (state[this._handlerName]) return;
    state[this._handlerName] = handler;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get expected() {
    return this._expected;
  }

  interpret() {
  }

  dispatch(state, session, context) {
    state[this.constructor._handlerName](session, this, context);
  }

  checkHandler(state) {
    if (!this._hasEventHandler(state)) {
      throw new Error(`${state.name} is missing an ${this.constructor._handlerName} event handler`);
    }
  }

  checkNoHandler(state) {
    if (this._hasEventHandler(state)) {
      throw new Error(`${state.name} has a redundant ${this.constructor._handlerName} event handler`);
    }
  }

  _hasEventHandler(state) {
    return Object.getPrototypeOf(state).hasOwnProperty(this.constructor._handlerName);
  }
}

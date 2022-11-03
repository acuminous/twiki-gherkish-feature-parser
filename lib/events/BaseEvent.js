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

  checkHandler(state) {
    if (!Object.getPrototypeOf(state).hasOwnProperty(this.constructor._handlerName)) {
      throw new Error(`${state.name} is missing an ${this.constructor._handlerName} event handler`);
    }
  }

  checkNoHandler(state) {
    if (Object.getPrototypeOf(state).hasOwnProperty(this.constructor._handlerName)) {
      throw new Error(`${state.name} has a redundant ${this.constructor._handlerName} event handler`);
    }
  }

  interpret() {
  }

  dispatch(state, session, context) {
    state[this.constructor._handlerName](session, this, context);
  }
}

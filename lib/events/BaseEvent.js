export default class BaseEvent {

  constructor({ description, expected, debug }) {
    this._name = this.constructor.name;
    this._description = description;
    this._expected = Boolean(expected);
    this._debug = debug;
  }

  static get _handlerName() {
    return `on${this.name.replace(/Event$/, '')}`;
  }

  static defineEventHandler(target, handler) {
    if (target[this._handlerName]) return;
    target[this._handlerName] = handler;
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

  _dispatch(state, session, payload) {
    this._debug(`Dispatching ${this.name} to ${state.name} via ${this.constructor._handlerName}`);
    state[this.constructor._handlerName](session, { ...payload, name: this.name, description: this.description });
    return true;
  }
}

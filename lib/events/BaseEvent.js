export default class BaseEvent {

  constructor({ description, expected, debug }) {
    this._name = this.constructor.name;
    this._description = description;
    this._expected = Boolean(expected);
    this._debug = debug;
  }

  static getHandlerName() {
    return `on${this.name.replace(/Event$/, '')}`;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get handlerName() {
    return this.constructor.getHandlerName();
  }

  get expected() {
    return this._expected;
  }

  checkHandler(state) {
    if (!Object.getPrototypeOf(state).hasOwnProperty(this.handlerName)) {
      throw new Error(`${state.name} is missing an ${this.handlerName} event handler`);
    }
  }

  _dispatch(state, session, payload) {
    this._debug(`Dispatching ${this.name} to ${state.name} via ${this.handlerName}`);
    state[this.handlerName](session, { ...payload, name: this.name, description: this.description });
    return true;
  }
}

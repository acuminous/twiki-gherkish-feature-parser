export default class BaseEvent {

  constructor({ description, handlerName, expected, debug }) {
    this._name = this.constructor.name;
    this._description = description;
    this._handlerName = handlerName;
    this._expected = Boolean(expected);
    this._debug = debug;
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
    if (!Object.getPrototypeOf(state).hasOwnProperty(this._handlerName)) {
      throw new Error(`${state.name} is missing an ${this._handlerName} event handler`);
    }
  }

  _dispatch(state, session, payload) {
    this._debug(`Dispatching ${this.name} to ${state.name}`);
    state[this._handlerName](session, { ...payload, name: this.name, description: this.description });
    return true;
  }
}

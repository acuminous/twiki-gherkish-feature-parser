export default class BaseEvent {

  constructor({ description, handlerName, debug }) {
    this._name = this.constructor.name;
    this._description = description;
    this._handlerName = handlerName;
    this._debug = debug;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  checkHandler(state) {
    if (!Object.hasOwn(Object.getPrototypeOf(state), this._handlerName)) {
      throw new Error(`${state.name} is missing an ${this._handlerName} event handler`);
    }
  }

  _dispatch(state, session, payload) {
    this._debug(`Dispatching event: ${this.name} to state: ${state.name}`);
    state[this._handlerName](session, payload);
    return true;
  }
}

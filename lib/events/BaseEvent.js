export default class BaseEvent {
  constructor({ debug }) {
    this._name = this.constructor.name;
    this._debug = debug;
  }

  get name() {
    return this._name;
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    this._debug(`Handing event: ${this._name} in state: ${state.name}`);
    this.notify(source, session, state, match);

    return true;
  }
};

import { MissingHandlerBug, RedundantHandlerBug } from '../Errors.js';

export default class BaseEvent {

  constructor({ expected = false, debug }) {
    this._name = this.constructor.name;
    this._description = this.constructor.description;
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
    if (!this._hasEventHandler(state)) throw new MissingHandlerBug(state, this.constructor._handlerName);
  }

  checkNoHandler(state) {
    if (this._hasEventHandler(state)) throw new RedundantHandlerBug(state, this.constructor._handlerName);
  }

  _hasEventHandler(state) {
    return Object.getPrototypeOf(state).hasOwnProperty(this.constructor._handlerName);
  }
}

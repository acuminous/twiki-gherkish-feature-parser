import debug from 'debug';
import { MissingHandlerBug, RedundantHandlerBug } from '../Errors.js';

export default class BaseEvent {

  #name = this.constructor.name;
  #description = this.constructor.description;
  #expected;
  #debug = debug(`twiki:gherkish-feature-parser:events:${this.#name}`);

  constructor({ expected = false }) {
    this.#expected = expected;
  }

  static get _handlerName() {
    return `on${this.name.replace(/Event$/, '')}`;
  }

  static defineEventHandler(state, handler) {
    if (state[this._handlerName]) return;
    state[this._handlerName] = handler;
  }

  get name() {
    return this.#name;
  }

  get description() {
    return this.#description;
  }

  get expected() {
    return this.#expected;
  }

  get _debug() {
    return this.#debug;
  }

  interpret() {
  }

  dispatch(state, session, context) {
    state[this.constructor._handlerName](session, this, context);
  }

  checkHandler(state) {
    if (!this.#hasEventHandler(state)) throw new MissingHandlerBug(state, this.constructor._handlerName);
  }

  checkNoHandler(state) {
    if (this.#hasEventHandler(state)) throw new RedundantHandlerBug(state, this.constructor._handlerName);
  }

  #hasEventHandler(state) {
    return Object.getPrototypeOf(state).hasOwnProperty(this.constructor._handlerName);
  }
}

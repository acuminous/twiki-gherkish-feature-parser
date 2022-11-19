import * as Events from '../events/index.js';
import { UnexpectedEventError, MissingEventHandlerError, MissingStateAlias, ConflictingStateAlias } from '../Errors.js';

export default class BaseState {

  constructor({ machine, events = [] }) {
    this._name = this.constructor.name;
    this._machine = machine;
    this._events = events.concat(new Events.MissingEventHandlerEvent());
    this._expectedEvents = this._events.filter((event) => event.expected);
    this._prepareEventHandlers();
  }

  static get handlerName() {
    return `to${this.name}`;
  }

  static get handlerAlias() {
    if (!this.alias) throw new MissingStateAlias(this);
    return `to${this.alias}`;
  }

  static defineTransitionHandler(target, handler) {
    if (target[this.handlerName]) return;
    target[this.handlerName] = handler;
  }

  static aliasTransitionHandler(target) {
    if (target[this.handlerAlias]) throw new ConflictingStateAlias(this);
    target[this.handlerAlias] = (session, event, context) => {
      delete target[this.handlerAlias];
      target[this.handlerName](session, event, context);
      return target;
    };
  }

  get name() {
    return this._name;
  }

  _prepareEventHandlers() {
    this._checkExpectedEventHandlers();
    this._checkRedundantEventHandlers();
    this._addUnexpectedEventHandlers();
  }

  _checkExpectedEventHandlers() {
    this._expectedEvents.forEach((event) => event.checkHandler(this));
  }

  _checkRedundantEventHandlers() {
    this._events.filter((event) => !event.expected).forEach((event) => event.checkNoHandler(this));
  }

  _addUnexpectedEventHandlers() {
    Object.values(Events).forEach((EventClass) => {
      EventClass.defineEventHandler(this, (session, event, context) => {
        this.onUnexpectedEvent(session, event, context);
      });
    });
  }

  getEvent(source, session) {
    return this._events.find((event) => event.test(source, session));
  }

  onUnexpectedEvent(session, event, context) {
    throw new UnexpectedEventError(this, session, event, context);
  }

  onMissingEventHandler(session, event, context) {
    throw new MissingEventHandlerError(this, session, event, context);
  }

  describeExpectedEvents() {
    return this._expectedEvents.map((event) => ` - ${event.description}\n`).sort((a, b) => a.localeCompare(b)).join('');
  }
}

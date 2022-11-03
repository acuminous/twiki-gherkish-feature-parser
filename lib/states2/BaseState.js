import * as Events from '../events/index.js';

export default class BaseState {

  constructor({ machine, events = [] }) {
    this._name = this.constructor.name;
    this._machine = machine;
    this._events = events.concat(new Events.MissingEventHandlerEvent());
    this._expectedEvents = this._events.filter((event) => event.expected);
    this._prepareEventHandlers();
  }

  static get _handlerName() {
    return `to${this.name}`;
  }

  static defineTransitionHandler(target, handler) {
    if (target[this._handlerName]) return;
    target[this._handlerName] = handler;
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
    throw new Error(`I did not expect ${event.description} at ${session.metadata?.source?.uri}:${context.source.number}\nInstead, I expected one of:\n${this._describeExpectedEvents()}`);
  }

  onMissingEventHandler(session, event, context) {
    throw new Error(`${this.name} has no event handler for '${context.source.line}' at ${session.metadata?.source?.uri}:${context.source.number}`);
  }

  _describeExpectedEvents() {
    return this._expectedEvents.map((event) => ` - ${event.description}\n`).sort((a, b) => a.localeCompare(b)).join('');
  }
}

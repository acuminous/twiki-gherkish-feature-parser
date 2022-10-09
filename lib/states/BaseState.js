import * as Events from '../events/index.js';

export default class BaseState {

  constructor({ machine, events = [] }) {
    this._machine = machine;
    this._events = events.concat(new Events.MissingEventHandlerEvent());
    this._expectedEvents = this._events.filter((event) => event.expected);
    this._checkExpectedEventHandlers();
    this._defineDefaultEventHandlers();
  }

  get name() {
    return this.constructor.name;
  }

  _checkExpectedEventHandlers() {
    this._expectedEvents.forEach((event) => event.checkHandler(this));
  }

  _defineDefaultEventHandlers() {
    Object.values(Events).forEach((EventClass) => {
      const instance = new EventClass();
      if (this[instance.handlerName]) return;
      this[instance.handlerName] = (session, event) => {
        this.onUnexpectedEvent(session, event);
      };
    });
  }

  handle(source, session) {
    this._events.find((event) => event.handle(source, session, this));
  }

  onUnexpectedEvent(session, event) {
    throw new Error(`I did not expect ${event.description} at ${session.metadata?.source?.uri}:${event.source.number}\nInstead, I expected one of:\n${this._describeExpectedEvents()}`);
  }

  onMissingEventHandler(session, event) {
    throw new Error(`${this.name} has no event handler for '${event.source.line}' at ${session.metadata?.source?.uri}:${event.source.number}`);
  }

  _describeExpectedEvents() {
    return this._expectedEvents.map((event) => ` - ${event.description}\n`).sort((a, b) => a.localeCompare(b)).join('');
  }
}

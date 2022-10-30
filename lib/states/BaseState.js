import * as Events from '../events/index.js';

export default class BaseState {

  constructor({ machine, events = [] }) {
    this._name = this.constructor.name;
    this._machine = machine;
    this._events = events.concat(new Events.MissingEventHandlerEvent());
    this._expectedEvents = this._events.filter((event) => event.expected);
    this._checkExpectedEventHandlers();
    this._addUnexpectedEventHandlers();
  }

  static getTransitionName() {
    return `to${this.name}`;
  }

  get name() {
    return this._name;
  }

  _checkExpectedEventHandlers() {
    this._expectedEvents.forEach((event) => event.checkHandler(this));
  }

  _addUnexpectedEventHandlers() {
    Object.values(Events).forEach((EventClass) => {
      EventClass.defineEventHandler(this, (session, event) => {
        this.onUnexpectedEvent(session, event);
      });
    });
  }

  interpret(source, session) {
    this._events.find((event) => event.interpret(source, session, this));
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

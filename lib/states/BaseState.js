import { MissingEventHandlerEvent } from '../events/index.js';

export default class BaseState {

  constructor({ machine, events = [], validEvents = [] }) {
    this._machine = machine;
    this._events = events.concat(MissingEventHandlerEvent).map((Clazz) => new Clazz());
    this._validEvents = validEvents.map((Clazz) => this._events.find((event) => event instanceof Clazz));
    this._validEvents.forEach((event) => event.checkHandler(this));
  }

  get name() {
    return this.constructor.name;
  }

  handle(source, session) {
    this._events.find((event) => event.handle(source, session, this));
  }

  onAnnotation(session, event) {
    this.onUnexpectedEvent(session, event);
  }

  onBackground(session, event) {
    this.onUnexpectedEvent(session, event);
  }

  onBlankLine(session, event) {
    this.onUnexpectedEvent(session, event);
  }

  onDocStringText(session, event) {
    this.onUnexpectedEvent(session, event);
  }

  onDocStringIndentStart(session, event) {
    this.onUnexpectedEvent(session, event);
  }

  onDocStringIndentStop(session, event) {
    this.onUnexpectedEvent(session, event);
  }

  onDocStringTokenStart(session, event) {
    this.onUnexpectedEvent(session, event);
  }

  onDocStringTokenStop(session, event) {
    this.onUnexpectedEvent(session, event);
  }

  onEnd(session, event) {
    this.onUnexpectedEvent(session, event);
  }

  onFeature(session, event) {
    this.onUnexpectedEvent(session, event);
  }

  onBlockComment(session, event) {
    this.onUnexpectedEvent(session, event);
  }

  onScenario(session, event) {
    this.onUnexpectedEvent(session, event);
  }

  onSingleLineComment(session, event) {
    this.onUnexpectedEvent(session, event);
  }

  onStep(session, event) {
    this.onUnexpectedEvent(session, event);
  }

  onText(session, event) {
    this.onUnexpectedEvent(session, event);
  }

  onUnexpectedEvent(session, event) {
    throw new Error(`I did not expect ${event.description} at ${session.metadata?.source?.uri}:${event.source.number}\nInstead, I expected one of:\n${this._describeValidEvents()}`);
  }

  onMissingEventHandlerEvent(session, event) {
    throw new Error(`${this.name} has no event handler for '${event.source.line}' at ${session.metadata?.source?.uri}:${event.source.number}`);
  }

  _describeValidEvents() {
    return this._validEvents.map((event) => ` - ${event.description}\n`).join('');
  }
}

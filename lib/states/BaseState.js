import { UnexpectedEvent } from '../events/index.js';

export default class BaseState {

  constructor({ machine, events = [], validEvents = [] }) {
    this._machine = machine;
    this._events = events.concat(UnexpectedEvent).map((Clazz) => new Clazz());
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
    this._handleUnexpectedEvent(session, event);
  }

  onBackground(session, event) {
    this._handleUnexpectedEvent(session, event);
  }

  onBlankLine(session, event) {
    this._handleUnexpectedEvent(session, event);
  }

  onDocString(session, event) {
    this._handleUnexpectedEvent(session, event);
  }

  onDocStringIndentStart(session, event) {
    this._handleUnexpectedEvent(session, event);
  }

  onDocStringIndentStop(session, event) {
    this._handleUnexpectedEvent(session, event);
  }

  onDocStringTokenStart(session, event) {
    this._handleUnexpectedEvent(session, event);
  }

  onDocStringTokenStop(session, event) {
    this._handleUnexpectedEvent(session, event);
  }

  onEnd(session, event) {
    throw new Error(`${event.description} was not expected at ${session.metadata?.source?.uri}:${event.source.number}\nExpected one of:\n${this._describeValidEvents()}`);
  }

  onFeature(session, event) {
    this._handleUnexpectedEvent(session, event);
  }

  onBlockComment(session, event) {
    this._handleUnexpectedEvent(session, event);
  }

  onScenario(session, event) {
    this._handleUnexpectedEvent(session, event);
  }

  onSingleLineComment(session, event) {
    this._handleUnexpectedEvent(session, event);
  }

  onStep(session, event) {
    this._handleUnexpectedEvent(session, event);
  }

  onText(session, event) {
    this._handleUnexpectedEvent(session, event);
  }

  onUnexpectedEvent(session, event) {
    throw new Error(`'${event.source.line}' was unexpected at ${session.metadata?.source?.uri}:${event.source.number}\nExpected one of:\n${this._describeValidEvents()}`);
  }

  _handleUnexpectedEvent(session, event) {
    throw new Error(`${event.description} was not expected at ${session.metadata?.source?.uri}:${event.source.number}\nExpected one of:\n${this._describeValidEvents()}`);
  }

  _describeValidEvents() {
    return this._validEvents.map((event) => ` - ${event.description}\n`).join('');
  }
}

import { UnexpectedEvent } from '../events/index.js';

export default class BaseState {

  constructor({ machine, events = [], validEvents = [] }) {
    this._machine = machine;
    this._events = events.concat(UnexpectedEvent).map((Clazz) => new Clazz());
    this._validEvents = validEvents.map((Clazz) => this._events.find((event) => event instanceof Clazz));
  }

  get name() {
    return this.constructor.name;
  }

  handle(source, session) {
    this._events.find((event) => event.handle(source, session, this));
  }

  onAnnotation(event, session) {
    this._handleUnexpectedEvent(event, session);
  }

  onBackground(event, session) {
    this._handleUnexpectedEvent(event, session);
  }

  onBlankLine(event, session) {
    this._handleUnexpectedEvent(event, session);
  }

  onDocString(event, session) {
    this._handleUnexpectedEvent(event, session);
  }

  onDocStringIndentStart(event, session) {
    this._handleUnexpectedEvent(event, session);
  }

  onDocStringIndentStop(event, session) {
    this._handleUnexpectedEvent(event, session);
  }

  onDocStringTokenStart(event, session) {
    this._handleUnexpectedEvent(event, session);
  }

  onDocStringTokenStop(event, session) {
    this._handleUnexpectedEvent(event, session);
  }

  onEnd(event, session) {
    throw new Error(`Unexpected end of feature at ${session.metadata?.source?.uri}:${event.source.number}\nExpected one of:\n${this._describeValidEvents()}`);
  }

  onFeature(event, session) {
    this._handleUnexpectedEvent(event, session);
  }

  onBlockComment(event, session) {
    this._handleUnexpectedEvent(event, session);
  }

  onScenario(event, session) {
    this._handleUnexpectedEvent(event, session);
  }

  onSingleLineComment(event, session) {
    this._handleUnexpectedEvent(event, session);
  }

  onStep(event, session) {
    this._handleUnexpectedEvent(event, session);
  }

  onText(event, session) {
    this._handleUnexpectedEvent(event, session);
  }

  onUnexpectedEvent(event, session) {
    this._handleUnexpectedEvent(event, session);
  }

  _handleUnexpectedEvent(event, session) {
    throw new Error(`'${event.source.line}' was unexpected at ${session.metadata?.source?.uri}:${event.source.number}\nExpected one of:\n${this._describeValidEvents()}`);
  }

  _describeValidEvents() {
    return this._validEvents.map((event) => ` - ${event.describe()}\n`).join('');
  }
}

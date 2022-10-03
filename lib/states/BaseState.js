import { UnexpectedEvent } from '../events/index.js';

export default class BaseState {
  constructor({ machine, events = [] }) {
    this._machine = machine;
    this._events = events.concat(UnexpectedEvent).map((Clazz) => new Clazz());
  }

  get name() {
    return this.constructor.name;
  }

  handle(source, session) {
    this._events.find((event) => event.handle(source, session, this));
  }

  onAnnotation(event) {
    this._handleUnexpectedEvent(event);
  }

  onBackground(event) {
    this._handleUnexpectedEvent(event);
  }

  onBlankLine() {}

  onDocString(event) {
    this._handleUnexpectedEvent(event);
  }

  onDocStringIndentStart(event) {
    this._handleUnexpectedEvent(event);
  }

  onDocStringIndentStop(event) {
    this._handleUnexpectedEvent(event);
  }

  onDocStringTokenStart(event) {
    this._handleUnexpectedEvent(event);
  }

  onDocStringTokenStop(event) {
    this._handleUnexpectedEvent(event);
  }

  onEnd(event) {
    throw new Error(`Premature end of specification in state: ${this.name} on line ${event.source.number}`);
  }

  onFeature(event) {
    this._handleUnexpectedEvent(event);
  }

  onMultiLineComment(event) {
    this._handleUnexpectedEvent(event);
  }

  onScenario(event) {
    this._handleUnexpectedEvent(event);
  }

  onSingleLineComment() {}

  onStep(event) {
    this._handleUnexpectedEvent(event);
  }

  onText(event) {
    this._handleUnexpectedEvent(event);
  }

  onUnexpectedEvent(event) {
    this._handleUnexpectedEvent(event);
  }

  _handleUnexpectedEvent(event) {
    throw new Error(`'${event.source.line}' was unexpected in state: ${this.name} on line ${event.source.number}'`);
  }
}

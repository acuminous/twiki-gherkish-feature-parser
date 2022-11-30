import * as Events from '../events/index.js';
import { UnexpectedEventError, MissingEventHandlerBug, MissingStateAliasBug } from '../Errors.js';

export default class BaseState {

  #name = this.constructor.name;
  #events;
  #expectedEvents;

  constructor({ machine, featureBuilder, events = [] }) {
    this._machine = machine;
    this._featureBuilder = featureBuilder;
    this.#events = events.concat(new Events.MissingEventHandlerEvent());
    this.#expectedEvents = this.#events.filter((event) => event.expected);
    this.#prepareEventHandlers();
  }

  static get handlerName() {
    return `to${this.name}`;
  }

  static get handlerAlias() {
    if (!this.alias) throw new MissingStateAliasBug(this);
    return `to${this.alias}`;
  }

  static defineTransitionHandler(target, handler) {
    if (target[this.handlerName]) return;
    target[this.handlerName] = handler;
  }

  static aliasTransitionHandler(target) {
    const originalHandler = target[this.handlerAlias];
    const underlyingHandler = target[this.handlerName];
    const temporaryHandler = (session, event, context) => {
      temporaryHandler.restore();
      underlyingHandler(session, event, context);
      return target;
    };
    temporaryHandler.restore = () => {
      delete target[this.handlerAlias];
      if (originalHandler) target[this.handlerAlias] = originalHandler;
    };
    target[this.handlerAlias] = temporaryHandler;
  }

  get name() {
    return this.#name;
  }

  #prepareEventHandlers() {
    this.#checkExpectedEventHandlers();
    this.#checkRedundantEventHandlers();
    this.#addUnexpectedEventHandlers();
  }

  #checkExpectedEventHandlers() {
    this.#expectedEvents.forEach((event) => event.checkHandler(this));
  }

  #checkRedundantEventHandlers() {
    this.#events.filter((event) => !event.expected).forEach((event) => event.checkNoHandler(this));
  }

  #addUnexpectedEventHandlers() {
    Object.values(Events).forEach((EventClass) => {
      EventClass.defineEventHandler(this, (session, event, context) => {
        this.onUnexpectedEvent(session, event, context);
      });
    });
  }

  getEvent(source, session) {
    return this.#events.find((event) => event.test(source, session));
  }

  onUnexpectedEvent(session, event, context) {
    throw new UnexpectedEventError(this, session, event, context);
  }

  onMissingEventHandler(session, event, context) {
    throw new MissingEventHandlerBug(this, session, event, context);
  }

  describeExpectedEvents() {
    return this.#expectedEvents.map((event) => ` - ${event.description}\n`).sort((a, b) => a.localeCompare(b)).join('');
  }
}

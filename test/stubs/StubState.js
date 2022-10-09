import * as Events from '../../lib/events/index.js';

export default class StubState {
  constructor(assertions = []) {
    this.count = 0;
    this.assertions = [].concat(assertions);
    this._defineEventHandlers();
  }

  _defineEventHandlers() {
    Object.values(Events).forEach((EventClass) => {
      const handlerName = EventClass.getHandlerName();
      this[handlerName] = (session, event) => {
        this.handleEvent(session, event);
      };
    });
  }

  handleEvent(session, event) {
    if (this.assertions[this.count]) this.assertions[this.count](event);
    this.count++;
    return this;
  }
}

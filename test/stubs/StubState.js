import * as Events from '../../lib/events/index.js';

export default class StubState {
  constructor(assertions = []) {
    this.count = 0;
    this.assertions = [].concat(assertions);
    this._defineEventHandlers();
  }

  _defineEventHandlers() {
    Object.values(Events).forEach((EventClass) => {
      EventClass.defineEventHandler(this, (session, event, context) => {
        this.handleEvent(session, event, context);
      });
    });
  }

  handleEvent(session, event, context) {
    if (this.assertions[this.count]) this.assertions[this.count](event, context);
    this.count++;
    return this;
  }
}

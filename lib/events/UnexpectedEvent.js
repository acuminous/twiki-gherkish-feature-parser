import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

export default class UnexpectedEvent extends BaseEvent {

  constructor() {
    const debug = Debug('twiki:gherkish-feature-parser:events:UnexpectedEvent');
    super({ handlerName: 'onUnexpectedEvent', debug });
  }

  handle(source, session, state) {
    this._dispatch(state, session, { name: this.name, source, data: {} });
    return true;
  }
}

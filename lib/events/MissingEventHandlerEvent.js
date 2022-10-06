import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

export default class MissingEventHandlerEvent extends BaseEvent {

  constructor() {
    const debug = Debug('twiki:gherkish-feature-parser:events:MissingEventHandlerEvent');
    super({ handlerName: 'onMissingEventHandlerEvent', debug });
  }

  handle(source, session, state) {
    return this._dispatch(state, session, { source, data: {} });
  }
}

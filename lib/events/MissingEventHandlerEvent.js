import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:MissingEventHandlerEvent');

export default class MissingEventHandlerEvent extends BaseEvent {

  constructor() {
    super({ handlerName: 'onMissingEventHandlerEvent', debug });
  }

  handle(source, session, state) {
    return this._dispatch(state, session, { source, data: {} });
  }
}

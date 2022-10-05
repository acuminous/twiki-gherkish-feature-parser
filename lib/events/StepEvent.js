import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class StepEvent extends BaseRegExpEvent {

  constructor() {
    const debug = Debug('twiki:gherkish-feature-parser:events:StepEvent');
    super({ description: 'A step', handlerName: 'onStep', regexp: /^(.*)$/, debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    const data = { text: match[0].trim() };
    session.indentation = source.indentation;
    this._dispatch(state, session, { name: this.name, source, data });

    return true;
  }
}

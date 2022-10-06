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

    this._updateSession(source, session);

    return this._dispatch(state, session, { name: this.name, source, data: this._getData(match) });
  }

  _updateSession(source, session) {
    session.indentation = source.indentation;
  }

  _getData(match) {
    return { text: match[0].trim() };
  }
}

import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

export default class DocStringEvent extends BaseEvent {

  constructor() {
    const debug = Debug('twiki:gherkish-feature-parser:events:DocStringEvent');
    super({ description: 'A DocString line', handlerName: 'onDocString', debug });
  }

  handle(source, session, state) {
    this._debug(`Testing text: "${source.line}" for event: ${this.name}`);
    if (!session.docString) return false;

    return this._dispatch(state, session, { source, data: this._getData(source, session) });
  }

  _getData(source, session) {
    return { text: source.line.substr(session.docString.indentation) };
  }
}

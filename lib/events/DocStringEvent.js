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

    const data = { text: source.line.substr(session.docString.indentation) };
    this._dispatch(state, session, { name: this.name, source, data });

    return true;
  }
}

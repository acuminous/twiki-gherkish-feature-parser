import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:DocStringTextEvent');

export default class DocStringTextEvent extends BaseEvent {

  constructor() {
    super({ description: 'a DocString line', handlerName: 'onDocStringText', debug });
  }

  handle(source, session, state) {
    debug(`Testing text: "${source.line}" for event: ${this.name}`);
    if (!session.docString) return false;

    return this._dispatch(state, session, { source, data: this._getData(source, session) });
  }

  _getData(source, session) {
    return { text: source.line.substr(session.docString.indentation) };
  }
}

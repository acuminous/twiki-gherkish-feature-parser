import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

export default class DocStringIndentStopEvent extends BaseEvent {

  constructor() {
    const debug = Debug('twiki:gherkish-feature-parser:events:DocStringIndentStopEvent');
    super({ description: 'The end of an indented DocString', handlerName: 'onDocStringIndentStop', debug });
  }

  handle(source, session, state) {
    this._debug(`Testing text: "${source.line}" for event: ${this._name}`);
    if (!session.docString || session.docString.token) return false;
    if (source.indentation >= session.docString.indentation) return false;

    delete session.docString;

    return this._dispatch(state, session, { name: this.name, source, data: {} });
  }
}

import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:DocStringIndentStopEvent');

export default class DocStringIndentStopEvent extends BaseEvent {

  constructor(props = {}) {
    super({ description: 'the end of an indented DocString', handlerName: 'onDocStringIndentStop', expected: props.expected, debug });
  }

  handle(source, session, state) {
    debug(`Testing text: "${source.line}" for event: ${this._name}`);
    if (!session.docString || session.docString.token) return false;
    if (source.indentation >= session.docString.indentation) return false;

    delete session.docString;

    return this._dispatch(state, session, { source, data: {} });
  }
}

import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ImplicitDocStringStopEvent');

export default class ImplicitDocStringStopEvent extends BaseEvent {

  constructor(props = {}) {
    super({ description: 'the end of an indented docstring', handlerName: 'onImplicitDocStringStop', expected: props.expected, debug });
  }

  handle(source, session, state) {
    debug(`Considering "${source.line}"`);
    if (!session.docstring || session.docstring.token) return false;
    if (source.indentation >= session.docstring.indentation) return false;

    delete session.docstring;

    return this._dispatch(state, session, { source, data: {} });
  }
}

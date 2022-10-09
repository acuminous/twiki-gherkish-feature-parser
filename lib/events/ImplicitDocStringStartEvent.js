import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ImplicitDocStringStartEvent');

export default class ImplicitDocStringStartEvent extends BaseEvent {

  constructor(props = {}) {
    super({ description: 'the start of an indented docstring', expected: props.expected, debug });
  }

  handle(source, session, state) {
    debug(`Considering "${source.line}"`);
    if (this._alreadyProcessingDocString(session) || this._notIndented(source, session)) return false;

    this._updateSession(source, session);

    return this._dispatch(state, session, { source, data: {} });
  }

  _alreadyProcessingDocString(session) {
    return !!session.docstring;
  }

  _notIndented(source, session) {
    return !(session.hasOwnProperty('indentation') && source.indentation > session.indentation);
  }

  _updateSession(source, session) {
    session.docstring = { indentation: source.indentation };
  }

}

import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:DocStringIndentStartEvent');

export default class DocStringIndentStartEvent extends BaseEvent {

  constructor() {
    super({ description: 'the start of an indented DocString', handlerName: 'onDocStringIndentStart', debug });
  }

  handle(source, session, state) {
    debug(`Testing text: "${source.line}" for event: ${this._name}`);
    if (this._alreadyProcessingDocString(session) || this._notIndented(source, session)) return false;

    this._updateSession(source, session);

    return this._dispatch(state, session, { source, data: {} });
  }

  _alreadyProcessingDocString(session) {
    return !!session.docString;
  }

  _notIndented(source, session) {
    return !(session.hasOwnProperty('indentation') && source.indentation > session.indentation);
  }

  _updateSession(source, session) {
    session.docString = { indentation: source.indentation };
  }

}

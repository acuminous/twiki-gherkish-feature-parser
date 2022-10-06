import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

export default class DocStringIndentStartEvent extends BaseEvent {

  constructor() {
    const debug = Debug('twiki:gherkish-feature-parser:events:DocStringIndentStartEvent');
    super({ description: 'The start of an indented DocString', handlerName: 'onDocStringIndentStart', debug });
  }

  handle(source, session, state) {
    this._debug(`Testing text: "${source.line}" for event: ${this._name}`);
    if (this._alreadyProcessingDocString(session) || this._notIndented(source, session)) return false;

    session.docString = { indentation: source.indentation };

    return this._dispatch(state, session, { name: this.name, source, data: {} });
  }

  _alreadyProcessingDocString(session) {
    return !!session.docString;
  }

  _notIndented(source, session) {
    return !(session.hasOwnProperty('indentation') && source.indentation > session.indentation);
  }
}

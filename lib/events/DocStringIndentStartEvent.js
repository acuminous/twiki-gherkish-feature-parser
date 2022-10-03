import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

export default class DocStringIndentStartEvent extends BaseEvent {
  constructor(props = {}) {
    const { debug = Debug('twiki-bdd:gherkish-feature-parser:events:BlankLineEvent') } = props;

    super({ debug });
  }

  handle(source, session, state) {
    this._debug(`Testing text: "${source.line}" against for event: ${this._name}`);
    if (this._alreadyProcessingDocString(session) || this._notIndented(source, session)) return false;

    this._debug(`Handing event: ${this._name} in state: ${state.name}`);
    session.docString = { indentation: source.indentation };
    state.onDocStringIndentStart({ name: this.name, source, data: {} }, session);

    return true;
  }

  _alreadyProcessingDocString(session) {
    return !!session.docString;
  }

  _notIndented(source, session) {
    return !(session.hasOwnProperty('indentation') && source.indentation > session.indentation);
  }
}

import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

export default class DocStringIndentStopEvent extends BaseEvent {
  constructor(props = {}) {
    const { debug = Debug('twiki-bdd:gherkish-feature-parser:events:DocStringIndentStopEvent') } = props;

    super({ debug });
  }

  handle(source, session, state) {
    this._debug(`Testing text: "${source.line}" against for event: ${this._name}`);
    if (!session.docString || session.docString.token) return false;
    if (source.indentation >= session.docString.indentation) return false;

    this._debug(`Handing event: ${this._name} in state: ${state.name}`);
    delete session.docString;
    state.onDocStringIndentStop({ name: this.name, source, data: {} }, session);

    return true;
  }
}

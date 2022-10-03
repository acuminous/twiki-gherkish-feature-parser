import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

export default class DocStringIndentStopEvent extends BaseEvent {

  constructor(props = {}) {
    const { debug = Debug('twiki:gherkish-feature-parser:events:DocStringIndentStopEvent') } = props;
    super({ debug });
  }

  handle(source, session, state) {
    this._debug(`Testing text: "${source.line}" for event: ${this._name}`);
    if (!session.docString || session.docString.token) return false;
    if (source.indentation >= session.docString.indentation) return false;

    this._debug(`Handing event: ${this.name} in state: ${state.name}`);
    delete session.docString;
    state.onDocStringIndentStop({ name: this.name, source, data: {} }, session);

    return true;
  }

  describe() {
    return 'The end of an indented DocString';
  }
}

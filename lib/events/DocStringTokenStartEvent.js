import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class DocStringTokenStartEvent extends BaseRegExpEvent {

  constructor(props = {}) {
    const { debug = Debug('twiki:gherkish-feature-parser:events:DocStringTokenStartEvent') } = props;
    super({ regexp: /^\s*([-"]{3,})\s*$/, debug });
  }

  handle(source, session, state) {
    if (session.docString) return false;

    const match = this._match(source, session);
    if (!match) return false;

    this._debug(`Handing event: ${this.name} in state: ${state.name}`);
    session.docString = { token: match[1], indentation: source.indentation };
    state.onDocStringTokenStart({ name: this.name, source, data: {} }, session);

    return true;
  }

  describe() {
    return 'The start of an explicit DocString';
  }
}

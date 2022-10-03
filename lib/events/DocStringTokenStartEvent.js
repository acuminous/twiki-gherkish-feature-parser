import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class DocStringTokenStartEvent extends BaseRegExpEvent {
  constructor(props = {}) {
    const { debug = Debug('twiki-bdd:gherkish-feature-parser:events:DocStringTokenStartEvent') } = props;

    super({ regexp: /^\s*([-"]{3,})\s*$/, debug });
  }

  handle(source, session, state) {
    if (session.docString) return false;

    const match = this._match(source, session);
    if (!match) return false;
    const token = match[1];

    this._debug(`Handing event: ${this._name} in state: ${state.name}`);
    session.docString = { token, indentation: source.indentation };
    state.onDocStringTokenStart({ name: this.name, source, data: {} }, session);

    return true;
  }
}

import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class DocStringTokenStopEvent extends BaseRegExpEvent {
  constructor(props = {}) {
    const { debug = Debug('yadda:gherkish:events:DocStringTokenStopEvent') } = props;

    super({ regexp: /^\s*([-"]{3,})\s*$/, debug });
  }

  handle(source, session, state) {
    this._debug(`Testing text: "${source.line}" against for event: ${this._name}`);
    if (!session.docString || !session.docString.token) return false;

    const match = this._match(source, session);
    if (!match) return false;
    const token = match[1];

    this._debug(`Testing session docString token: "${session.docString.token}" against ${token}`);
    if (token !== session.docString.token) return false;

    this._debug(`Handing event: ${this._name} in state: ${state.name}`);
    delete session.docString;
    state.onDocStringTokenStop({ name: this.name, source, data: {} }, session);

    return true;
  }
};

import Debug from 'debug';
import BaseEvent from './BaseEvent.js';

export default class DocStringEvent extends BaseEvent {
  constructor(props = {}) {
    const { debug = Debug('yadda:gherkish:events:DocStringEvent') } = props;

    super({ debug });
  }

  handle(source, session, state) {
    this._debug(`Testing text: "${source.line}" against for event: ${this._name}`);
    if (!session.docString) return false;

    this._debug(`Handing event: ${this._name} in state: ${state.name}`);
    const data = { text: source.line.substr(session.docString.indentation) };
    state.onDocString({ name: this.name, source, data }, session);

    return true;
  }
};

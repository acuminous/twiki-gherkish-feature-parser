import Debug from 'debug';
import BaseKeywordEvent from './BaseKeywordEvent.js';

export default class BackgroundEvent extends BaseKeywordEvent {

  constructor(props = {}) {
    const { debug = Debug('twiki:gherkish-feature-parser:events:BackgroundEvent') } = props;
    super({ keyword: 'background', debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    this._debug(`Handling event: ${this.name} in state: ${state.name}`);
    const data = { title: match[1].trim() };
    delete session.indentation;
    state.onBackground({ name: this.name, source, data }, session);

    return true;
  }

  describe() {
    return 'A background';
  }
}

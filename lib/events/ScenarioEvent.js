import Debug from 'debug';
import BaseKeywordEvent from './BaseKeywordEvent.js';

export default class ScenarioEvent extends BaseKeywordEvent {

  constructor(props = {}) {
    const { debug = Debug('twiki:gherkish-feature-parser:events:ScenarioEvent') } = props;
    super({ keyword: 'scenario', debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    this._debug(`Handling event: ${this.name} in state: ${state.name}`);
    const data = { title: match[1].trim() };
    delete session.indentation;
    state.onScenario({ name: this.name, source, data }, session);

    return true;
  }
}

import Debug from 'debug';
import BaseKeywordEvent from './BaseKeywordEvent.js';

export default class ScenarioEvent extends BaseKeywordEvent {

  constructor() {
    const debug = Debug('twiki:gherkish-feature-parser:events:ScenarioEvent');
    super({ description: 'A scenario', handlerName: 'onScenario', keyword: 'scenario', debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    const data = { title: match[1].trim() };
    delete session.indentation;
    this._dispatch(state, session, { name: this.name, source, data });

    return true;
  }
}

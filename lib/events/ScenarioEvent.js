import Debug from 'debug';
import BaseKeywordEvent from './BaseKeywordEvent.js';

export default class ScenarioEvent extends BaseKeywordEvent {

  constructor() {
    const debug = Debug('twiki:gherkish-feature-parser:events:ScenarioEvent');
    super({ description: 'a scenario', handlerName: 'onScenario', keyword: 'scenario', debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    this._updateSEssion(session);

    return this._dispatch(state, session, { source, data: this._getData(match) });
  }

  _updateSEssion(session) {
    delete session.indentation;
  }

  _getData(match) {
    return { title: match[1].trim() };
  }
}

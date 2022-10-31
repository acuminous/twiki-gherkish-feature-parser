import Debug from 'debug';
import BaseKeywordEvent from './BaseKeywordEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ScenarioEvent');

export default class ScenarioEvent extends BaseKeywordEvent {

  constructor(props = {}) {
    super({ description: 'a scenario', expected: props.expected, keyword: 'scenario', debug });
  }

  interpret(source, session) {
    const match = this._match(source, session);
    this._updateSession(session);
    return this._getData(match);
  }

  _updateSession(session) {
    delete session.indentation;
  }

  _getData(match) {
    return { title: match[1].trim() };
  }
}

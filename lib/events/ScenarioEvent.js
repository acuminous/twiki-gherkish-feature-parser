import Debug from 'debug';
import BaseKeywordEvent from './BaseKeywordEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ScenarioEvent');

export default class ScenarioEvent extends BaseKeywordEvent {

  constructor(props = {}) {
    super({ description: 'a scenario', expected: props.expected, keyword: 'scenario', debug });
  }

  interpret(source, session) {
    session.clearIndentation();
    return this._getData(source, session);
  }

  _getData(source, session) {
    const [, title] = this._match(source, session);
    return { title: title.trim() };
  }
}

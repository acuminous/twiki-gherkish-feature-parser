import Debug from 'debug';
import BaseKeywordEvent from './BaseKeywordEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ScenarioEvent');

export default class ScenarioEvent extends BaseKeywordEvent {

  static description = 'a scenario';

  constructor(props = {}) {
    super({ expected: props.expected, keyword: 'scenario', debug });
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

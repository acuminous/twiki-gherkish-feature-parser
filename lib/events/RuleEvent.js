import Debug from 'debug';
import BaseKeywordEvent from './BaseKeywordEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:RuleEvent');

export default class RuleEvent extends BaseKeywordEvent {

  static description = 'a rule';

  constructor(props = {}) {
    super({ expected: props.expected, keyword: 'rule', debug });
  }

  interpret(source, session) {
    return this._getData(source, session);
  }

  _getData(source, session) {
    const [, title] = this._match(source, session);
    return { title: title.trim() };
  }
}

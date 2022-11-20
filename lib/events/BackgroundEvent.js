import Debug from 'debug';
import BaseKeywordEvent from './BaseKeywordEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:BackgroundEvent');

export default class BackgroundEvent extends BaseKeywordEvent {

  static description = 'a background';

  constructor(props = {}) {
    super({ expected: props.expected, keyword: 'background', debug });
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

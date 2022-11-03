import Debug from 'debug';
import BaseKeywordEvent from './BaseKeywordEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:BackgroundEvent');

export default class BackgroundEvent extends BaseKeywordEvent {

  constructor(props = {}) {
    super({ description: 'a background', expected: props.expected, keyword: 'background', debug });
  }

  interpret(source, session) {
    const [, title] = this._match(source, session);
    session.clearIndentation();
    return { title: title.trim() };
  }
}

import Debug from 'debug';
import BaseKeywordEvent from './BaseKeywordEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ExampleTableEvent');

export default class ExampleTableEvent extends BaseKeywordEvent {

  constructor(props = {}) {
    super({ description: 'some examples', expected: props.expected, keyword: 'examples', debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    return this._dispatch(state, session, { source, data: {} });
  }
}

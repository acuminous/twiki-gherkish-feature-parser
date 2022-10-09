import Debug from 'debug';
import BaseKeywordEvent from './BaseKeywordEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:ExamplesEvent');

export default class ExamplesEvent extends BaseKeywordEvent {

  constructor(props = {}) {
    super({ description: 'some examples', handlerName: 'onExamples', expected: props.expected, keyword: 'examples', debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    return this._dispatch(state, session, { source, data: {} });
  }
}

import Debug from 'debug';
import BaseKeywordEvent from './BaseKeywordEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:FeatureEvent');

export default class FeatureEvent extends BaseKeywordEvent {

  constructor(props = {}) {
    super({ description: 'a feature', expected: props.expected, keyword: 'feature', debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    return this._dispatch(state, session, { source, data: this._getData(match) });
  }

  _getData(match) {
    return { title: match[1].trim() };
  }
}

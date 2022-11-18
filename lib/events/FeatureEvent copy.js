import Debug from 'debug';
import BaseKeywordEvent from './BaseKeywordEvent.js';

const debug = Debug('twiki:gherkish-feature-parser:events:FeatureEvent');

export default class FeatureEvent extends BaseKeywordEvent {

  constructor(props = {}) {
    super({ description: 'a feature', expected: props.expected, keyword: 'feature', debug });
  }

  interpret(source, session) {
    return this._getData(source, session);
  }

  _getData(source, session) {
    const [, title] = this._match(source, session);
    return { title: title.trim() };
  }
}
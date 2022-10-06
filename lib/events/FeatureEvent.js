import Debug from 'debug';
import BaseKeywordEvent from './BaseKeywordEvent.js';

export default class FeatureEvent extends BaseKeywordEvent {

  constructor() {
    const debug = Debug('twiki:gherkish-feature-parser:events:FeatureEvent');
    super({ description: 'A feature', handlerName: 'onFeature', keyword: 'feature', debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    return this._dispatch(state, session, { name: this.name, source, data: this._getData(match) });
  }

  _getData(match) {
    return { title: match[1].trim() };
  }
}

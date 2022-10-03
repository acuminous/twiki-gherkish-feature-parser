import Debug from 'debug';
import BaseKeywordEvent from './BaseKeywordEvent.js';

export default class FeatureEvent extends BaseKeywordEvent {

  constructor(props = {}) {
    const { debug = Debug('twiki:gherkish-feature-parser:events:FeatureEvent') } = props;
    super({ keyword: 'feature', debug });
  }

  notify(source, session, state, match) {
    const data = { title: match[1].trim() };
    state.onFeature({ name: this.name, source, data }, session);
  }
}

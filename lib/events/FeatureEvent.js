import Debug from 'debug';
import BaseKeywordEvent from './BaseKeywordEvent.js';

export default class FeatureEvent extends BaseKeywordEvent {

  constructor(props = {}) {
    const { debug = Debug('twiki:gherkish-feature-parser:events:FeatureEvent') } = props;
    super({ keyword: 'feature', debug });
  }

  handle(source, session, state) {
    const match = this._match(source, session);
    if (!match) return false;

    this._debug(`Handling event: ${this.name} in state: ${state.name}`);
    const data = { title: match[1].trim() };
    state.onFeature({ name: this.name, source, data }, session);

    return true;
  }

  describe() {
    return 'A feature';
  }
}

import Debug from 'debug';
import BaseVocabularyEvent from './BaseVocabularyEvent.js';

export default class FeatureEvent extends BaseVocabularyEvent {
  constructor(props = {}) {
    const { debug = Debug('twiki-bdd:gherkish-feature-parser:events:FeatureEvent') } = props;

    super({ vocabulary: 'feature', debug });
  }

  notify(source, session, state, match) {
    const data = { title: match[1].trim() };
    state.onFeature({ name: this.name, source, data }, session);
  }
}

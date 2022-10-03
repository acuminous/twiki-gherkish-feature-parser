import Debug from 'debug';
import BaseVocabularyEvent from './BaseVocabularyEvent.js';

export default class ScenarioEvent extends BaseVocabularyEvent {
  constructor(props = {}) {
    const { debug = Debug('twiki-bdd:gherkish-feature-parser:events:ScenarioEvent') } = props;

    super({ vocabulary: 'scenario', debug });
  }

  notify(source, session, state, match) {
    const data = { title: match[1].trim() };
    delete session.indentation;
    state.onScenario({ name: this.name, source, data }, session);
  }
}

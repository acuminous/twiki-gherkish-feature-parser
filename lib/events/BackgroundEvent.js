import Debug from 'debug';
import BaseVocabularyEvent from './BaseVocabularyEvent.js';

export default class BackgroundEvent extends BaseVocabularyEvent {
  constructor(props = {}) {
    const { debug = Debug('twiki-bdd:gherkish-feature-parser:events:BackgroundEvent') } = props;

    super({ vocabulary: 'background', debug });
  }

  notify(source, session, state, match) {
    const data = { title: match[1].trim() };
    delete session.indentation;
    state.onBackground({ name: this.name, source, data }, session);
  }
}

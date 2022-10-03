import Debug from 'debug';
import BaseKeywordEvent from './BaseKeywordEvent.js';

export default class BackgroundEvent extends BaseKeywordEvent {

  constructor(props = {}) {
    const { debug = Debug('twiki:gherkish-feature-parser:events:BackgroundEvent') } = props;
    super({ keyword: 'background', debug });
  }

  notify(source, session, state, match) {
    const data = { title: match[1].trim() };
    delete session.indentation;
    state.onBackground({ name: this.name, source, data }, session);
  }
}

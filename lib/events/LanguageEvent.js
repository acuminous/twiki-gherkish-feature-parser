import Debug from 'debug';
import BaseRegExpEvent from './BaseRegExpEvent.js';

export default class LanguageEvent extends BaseRegExpEvent {
  constructor(props = {}) {
    const { debug = Debug('yadda:gherkish:events:LanguageEvent') } = props;

    super({ regexp: /^\s*#\s*language\s*:(.*)$/i, debug });
  }

  notify(source, session, state, match) {
    const data = { name: match[1].trim() };
    state.onLanguage({ name: this.name, source, data }, session);
  }
}

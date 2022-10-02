import BaseEvent from './BaseEvent.js';

export default class BaseVocabularyEvent extends BaseEvent {
  constructor({ vocabulary, debug }) {
    super({ debug });
    this._vocabulary = vocabulary;
  }

  _match(source, session) {
    const regexp = session.language.regexp(this._vocabulary);
    this._debug(`Testing text: "${source.line}" against for event: ${this._name} using regexp: ${regexp}`);
    return regexp.exec(source.line);
  }
}

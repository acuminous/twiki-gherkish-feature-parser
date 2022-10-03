export default class Language {
  constructor(props) {
    const { name = this.constructor.name, code = undefined, vocabulary, debug } = props;

    this._name = name;
    this._code = code;
    this._regexp = {
      feature: new RegExp(`^\\s*(?:${vocabulary.feature.join('|')})\\s*:\\s*(.*)`, 'i'),
      background: new RegExp(`^\\s*(?:${vocabulary.background.join('|')})\\s*:\\s*(.*)`, 'i'),
      scenario: new RegExp(`^\\s*(?:${vocabulary.scenario.join('|')})\\s*:\\s*(.*)`, 'i'),
    };
    this._debug = debug;
  }

  get name() {
    return this._name;
  }

  get code() {
    return this._code;
  }

  answersToName(name) {
    return !!(name && this._name && this._name.toLowerCase() === name.toLowerCase());
  }

  answersToCode(code) {
    return !!(code && this._code && this._code.toLowerCase() === code.toLowerCase());
  }

  regexp(type) {
    return this._regexp[type];
  }

  toString() {
    return this.code ? `${this.name}/${this.code}` : this.name;
  }
}

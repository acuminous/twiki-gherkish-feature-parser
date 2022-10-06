export default class Language {

  constructor(props) {
    const { name = this.constructor.name, code = undefined, keywords } = props;
    this._name = name;
    this._code = code;
    this._regexp = {
      feature: new RegExp(`^\\s*(?:${keywords.feature.join('|')})\\s*:\\s*(.*)`, 'i'),
      background: new RegExp(`^\\s*(?:${keywords.background.join('|')})\\s*:\\s*(.*)`, 'i'),
      scenario: new RegExp(`^\\s*(?:${keywords.scenario.join('|')})\\s*:\\s*(.*)`, 'i'),
    };
  }

  get name() {
    return this._name;
  }

  get code() {
    return this._code;
  }

  regexp(keyword) {
    return this._regexp[keyword];
  }

  toString() {
    return this.code ? `${this.name}/${this.code}` : this.name;
  }
}

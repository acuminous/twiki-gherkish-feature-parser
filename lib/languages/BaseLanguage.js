import { MissingTranslationPullRequest } from '../Errors.js';

export default class Language {

  constructor(props) {
    const { name = this.constructor.name, code = undefined, keywords } = props;
    this._name = name;
    this._code = code;
    this._regexp = {
      feature: new RegExp(`^\\s*(?:${keywords.feature.join('|')})\\s*:\\s*(.*)`, 'i'),
      background: new RegExp(`^\\s*(?:${keywords.background.join('|')})\\s*:\\s*(.*)`, 'i'),
      rule: new RegExp(`^\\s*(?:${keywords.rule.join('|')})\\s*:\\s*(.*)`, 'i'),
      scenario: new RegExp(`^\\s*(?:${keywords.scenario.join('|')})\\s*:\\s*(.*)`, 'i'),
      examples: new RegExp(`^\\s*(?:${keywords.examples.join('|')})\\s*:\\s*(.*)`, 'i'),
    };
  }

  get name() {
    return this._name;
  }

  get code() {
    return this._code;
  }

  translate(keyword) {
    if (!this._regexp.hasOwnProperty(keyword)) throw new MissingTranslationPullRequest(this, keyword);
    return this._regexp[keyword];
  }

  toString() {
    return this.code ? `${this.name}/${this.code}` : this.name;
  }
}

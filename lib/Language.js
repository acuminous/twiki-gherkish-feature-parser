import { MissingTranslationPullRequest } from './Errors.js';

export default class Language {

  #name;
  #regexp;

  constructor(props) {
    const { name = this.constructor.name, keywords } = props;
    this.#name = name;
    this.#regexp = {
      feature: new RegExp(`^\\s*(?:${keywords.feature.join('|')})\\s*:\\s*(.*)`, 'i'),
      background: new RegExp(`^\\s*(?:${keywords.background.join('|')})\\s*:\\s*(.*)`, 'i'),
      rule: new RegExp(`^\\s*(?:${keywords.rule.join('|')})\\s*:\\s*(.*)`, 'i'),
      scenario: new RegExp(`^\\s*(?:${keywords.scenario.join('|')})\\s*:\\s*(.*)`, 'i'),
      examples: new RegExp(`^\\s*(?:${keywords.examples.join('|')})\\s*:\\s*(.*)`, 'i'),
    };
  }

  get name() {
    return this.#name;
  }

  translate(keyword) {
    if (!this.#regexp.hasOwnProperty(keyword)) throw new MissingTranslationPullRequest(this, keyword);
    return this.#regexp[keyword];
  }
}

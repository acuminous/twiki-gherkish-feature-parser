/* eslint-disable import/no-dynamic-require */
import { createRequire } from 'node:module';
import path from 'node:path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const pathToPackageJson = path.join(__dirname, '..', '..', 'package.json');
const require = createRequire(import.meta.url);
const { bugs: { url: issuesUrl } } = require(pathToPackageJson);

export default class Language {

  constructor(props) {
    const { name = this.constructor.name, code = undefined, keywords } = props;
    this._name = name;
    this._code = code;
    this._regexp = {
      feature: new RegExp(`^\\s*(?:${keywords.feature.join('|')})\\s*:\\s*(.*)`, 'i'),
      background: new RegExp(`^\\s*(?:${keywords.background.join('|')})\\s*:\\s*(.*)`, 'i'),
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
    if (!this._regexp.hasOwnProperty(keyword)) throw new Error(`${this.name} is missing a translation for the "${keyword}" keyword. Please submit a pull request to ${issuesUrl.replace(/\/issues/, '')}`);
    return this._regexp[keyword];
  }

  toString() {
    return this.code ? `${this.name}/${this.code}` : this.name;
  }
}

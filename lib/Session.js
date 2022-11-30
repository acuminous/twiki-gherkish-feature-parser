import Debug from 'debug';
import Languages from './languages/index.js';

const debug = Debug('twiki:gherkish-feature-parser:Session');

const EXPLICIT_DOCSTRING_TYPE = 'explicit';
const IMPLICIT_DOCSTRING_TYPE = 'implicit';

export default class Session {

  #language;
  #indentation = 0;
  #docstring;
  #examples;

  constructor(options = {}) {
    this.#language = options.language || Languages.English;
  }

  translate(keyword) {
    return this.#language.translate(keyword);
  }

  isProcessingDocstring() {
    const result = Boolean(this.#docstring);
    debug(`Checking whether session is currently processing a docstring: ${result}`);
    return result;
  }

  isProcessingImplicitDocstring() {
    const result = this.#docstring?.type === IMPLICIT_DOCSTRING_TYPE;
    debug(`Checking whether session is currently processing an implicit docstring: ${result}`);
    return result;
  }

  isProcessingMatchingDocstring(delimiter) {
    const result = this.#docstring?.type === EXPLICIT_DOCSTRING_TYPE && this.#docstring?.delimiter === delimiter;
    debug(`Checking whether session is processing a matching docstring: ${result}`);
    return result;
  }

  isIndented(source) {
    const result = this.#indentation !== undefined && source.indentation > this.#indentation;
    debug(`Checking whether "${source.line}" is indented: ${result}`);
    return result;
  }

  beginExplicitDocstring(delimiter, indentation) {
    this.#docstring = { type: EXPLICIT_DOCSTRING_TYPE, delimiter, indentation };
    return this;
  }

  beginImplicitDocstring(indentation) {
    this.#docstring = { type: IMPLICIT_DOCSTRING_TYPE, indentation };
    return this;
  }

  endDocstring() {
    this.#docstring = undefined;
    return this;
  }

  trimDocstring(text) {
    return text.substr(this.#docstring.indentation);
  }

  indent(indentation) {
    this.#indentation = indentation;
    return this;
  }

  clearIndentation() {
    this.#indentation = undefined;
    return this;
  }

  countExampleHeadings(headings) {
    this.#examples = { count: headings.length };
    return this;
  }

  get numberOfExamples() {
    return this.#examples.count;
  }
}

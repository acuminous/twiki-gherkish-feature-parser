import Debug from 'debug';
import Languages from './languages/index.js';

const debug = Debug('twiki:gherkish-feature-parser:Session');

export default class Session {

  constructor(props = {}) {
    this.language = props.language || Languages.English;
    this.indentation = 0;
  }

  isProcessingDocstring() {
    const result = Boolean(this.docstring);
    debug(`Checking whether session is currently processing a docstring: ${result}`);
    return result;
  }

  isProcessingImplicitDocstring() {
    const result = Boolean(this.docstring && !this.docstring.delimiter);
    debug(`Checking whether session is currently processing an implicit docstring: ${result}`);
    return result;
  }

  isProcessingMatchingDocstring(delimiter) {
    const result = Boolean(this.docstring && this.docstring.delimiter === delimiter);
    debug(`Checking whether session is processing a matching docstring: ${result}`);
    return result;
  }

  isIndented(source) {
    const result = this.hasOwnProperty('indentation') && source.indentation > this.indentation;
    debug(`Checking whether "${source.line}" is indented: ${result}`);
    return result;
  }

  beginExplicitDocstring(delimiter, indentation) {
    this.docstring = { type: 'explicit', delimiter, indentation };
    return this;
  }

  beginImplicitDocstring(indentation) {
    this.docstring = { type: 'implicit', indentation };
    return this;
  }

  endDocstring() {
    delete this.docstring;
    return this;
  }

  trimDocstring(text) {
    return text.substr(this.docstring.indentation);
  }

  indent(indentation) {
    this.indentation = indentation;
    return this;
  }

  clearIndentation() {
    delete this.indentation;
    return this;
  }

  countExampleHeadings(headings) {
    this.examples = { count: headings.length };
    return this;
  }

  get numberOfExamples() {
    return this.examples.count;
  }
}

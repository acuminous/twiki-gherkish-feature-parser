import Debug from 'debug';
import Languages from './languages/index.js';

const debug = Debug('twiki:gherkish-feature-parser:Session');

export default class Session {

  constructor(props = {}) {
    this.language = props.language || Languages.English;
    this.indentation = props.indentation || 0;
    this.metadata = props.metadata || {};
    if (props.docstring) this.docstring = props.docstring;
  }

  isProcessingDocstring() {
    const result = Boolean(this.docstring);
    debug(`Checking if session is currently processing a docstring: ${result}`);
    return result;
  }

  isProcessingImplicitDocstring() {
    const result = Boolean(this.docstring && !this.docstring.delimiter);
    debug(`Checking if session is currently processing an implicit docstring: ${result}`);
    return result;
  }

  isProcessingMatchingDocstring(delimiter) {
    const result = this.docstring?.delimiter === delimiter;
    debug(`Checking if session is processing a matching docstring: ${result}`);
    return result;
  }

  isIndented(source) {
    const result = this.hasOwnProperty('indentation') && source.indentation > this.indentation;
    debug(`Checking if "${source.line}" is indented: ${result}`);
    return result;
  }

  beginExplicitDocstring(delimiter, indentation) {
    this.docstring = { type: 'explicit', delimiter, indentation };
  }

  beginImplicitDocstring(indentation) {
    this.docstring = { type: 'implicit', indentation };
  }

  endDocstring() {
    delete this.docstring;
  }

  setIndentation(indentation) {
    this.indentation = indentation;
  }

  resetIndentation() {
    this.indentation = 0;
  }
}

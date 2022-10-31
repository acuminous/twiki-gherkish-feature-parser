import Languages from './languages/index.js';

export default class Session {

  constructor(props = {}) {
    this.language = props.language || Languages.English;
    this.indentation = props.indendation || 0;
    this.metadata = props.metadata || {};
    if (props.docstring) this.docstring = props.docstring;
  }

  isProcessingDocString() {
    return Boolean(this.docstring);
  }

  isProcessingImplicitDocString() {
    return Boolean(this.docstring && !this.docstring.token);
  }

  isProcessingExplicitDocString(token) {
    return this.docstring?.token === token;
  }

  isIndented(source) {
    return this.hasOwnProperty('indentation') && source.indentation > this.indentation;
  }
}

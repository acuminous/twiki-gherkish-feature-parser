import Languages from './languages/index.js';

export default class Session {

  constructor(props = {}) {
    this.language = props.language || Languages.English;
    this.indentation = props.indentation || 0;
    this.metadata = props.metadata || {};
    if (props.docstring) this.docstring = props.docstring;
  }

  isProcessingDocstring() {
    return Boolean(this.docstring);
  }

  isProcessingImplicitDocstring() {
    return Boolean(this.docstring && !this.docstring.token);
  }

  isProcessingExplicitDocstring(token) {
    return this.docstring?.token === token;
  }

  isIndented(source) {
    return this.hasOwnProperty('indentation') && source.indentation > this.indentation;
  }
}

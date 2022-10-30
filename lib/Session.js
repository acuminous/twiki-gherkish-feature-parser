import Languages from './languages/index.js';

export default class Session {

  constructor(props = {}) {
    this.language = props.language || Languages.English;
    this.indentation = props.indendation || 0;
    this.metadata = props.metadata || {};
  }

}

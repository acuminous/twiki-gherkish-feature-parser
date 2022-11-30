import BaseState from './BaseState.js';

export default class EndDocstringState extends BaseState {

  static alias = this.name;

  constructor({ machine, featureBuilder, events, debug }) {
    super({ machine, featureBuilder, events, debug });
  }
}

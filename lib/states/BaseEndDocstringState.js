import BaseState from './BaseState.js';

export default class EndDocstringState extends BaseState {

  static alias = this.name;

  constructor({ machine, events, debug }) {
    super({ machine, events, debug });
  }
}

import Debug from 'debug';
import BaseState from './BaseState.js';

const debug = Debug('twiki:gherkish-feature-parser:states:FinalState');

export default class FinalState extends BaseState {
  constructor() {
    super({ debug });
  }
}

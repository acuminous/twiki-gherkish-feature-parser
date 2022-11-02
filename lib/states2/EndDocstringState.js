import Debug from 'debug';
import BaseState from './BaseState.js';

const debug = Debug('twiki:gherkish-feature-parser:states:EndDocstringState');

const events = [
];

export default class EndDocstringState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events, debug });
    this._featureBuilder = featureBuilder;
  }

}

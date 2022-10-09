import Debug from 'debug';
import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:CreateScenarioStepExplicitDocStringState');

const events = [
  new Events.EndEvent(),
  new Events.ExplicitDocStringStopEvent(),
  new Events.DocStringTextEvent({ expected: true }),
];

export default class CreateScenarioStepExplicitDocStringState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events, debug });
    this._featureBuilder = featureBuilder;
  }

  onDocStringText(session, event) {
    this._featureBuilder.createScenarioStepDocString({ ...event.data });
    this._machine.toConsumeScenarioStepExplicitDocStringState();
  }
}

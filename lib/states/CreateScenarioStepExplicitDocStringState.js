import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const events = [
  new Events.EndEvent(),
  new Events.ExplicitDocStringStopEvent({ expected: true }),
  new Events.DocStringTextEvent({ expected: true }),
];

export default class CreateScenarioStepExplicitDocStringState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events });
    this._featureBuilder = featureBuilder;
  }

  onDocStringText(session, event) {
    this._featureBuilder.createScenarioStepDocString({ ...event.data });
  }

  onExplicitDocStringStop() {
    this._machine.toAfterScenarioStepDocStringState();
  }
}

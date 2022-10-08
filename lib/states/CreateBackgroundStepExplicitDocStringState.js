import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const events = [
  new Events.EndEvent(),
  new Events.ExplicitDocStringStopEvent(),
  new Events.DocStringTextEvent({ expected: true }),
];

export default class CreateBackgroundStepExplicitDocStringState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events });
    this._featureBuilder = featureBuilder;
  }

  onDocStringText(session, event) {
    this._featureBuilder.createBackgroundStepDocString({ ...event.data });
    this._machine.toConsumeBackgroundStepExplicitDocStringState();
  }
}

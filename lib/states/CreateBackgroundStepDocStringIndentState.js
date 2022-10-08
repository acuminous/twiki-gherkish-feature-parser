import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const events = [
  new Events.EndEvent({ expected: true }),
  new Events.DocStringTokenStartEvent(),
  new Events.DocStringIndentStartEvent(),
  new Events.DocStringTokenStopEvent(),
  new Events.DocStringIndentStopEvent({ expected: true }),
  new Events.DocStringTextEvent({ expected: true }),
];

export default class CreateBackgroundStepDocStringIndentState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events });
    this._featureBuilder = featureBuilder;
  }

  onDocStringText(session, event) {
    this._featureBuilder.createBackgroundStepDocString({ ...event.data });
  }

  onDocStringIndentStop(session, event) {
    this._machine.toAfterBackgroundStepDocStringState();
    this._machine.handle(event.source, session);
  }

  onEnd() {
    this._machine.toFinalState();
  }
}

import BaseState from './BaseState.js';
import { DocStringIndentStartEvent, DocStringIndentStopEvent, DocStringTokenStartEvent, DocStringTokenStopEvent, EndEvent, DocStringEvent } from '../events/index.js';

const events = [EndEvent, DocStringTokenStartEvent, DocStringIndentStartEvent, DocStringTokenStopEvent, DocStringIndentStopEvent, DocStringEvent];

export default class CreateScenarioStepDocStringState extends BaseState {
  constructor({ machine, featureBuilder }) {
    super({ machine, featureBuilder, events });
    this._featureBuilder = featureBuilder;
  }

  onDocString(event) {
    this._featureBuilder.createScenarioStepDocString({ ...event.data });
  }

  onDocStringIndentStop(event, session) {
    this._machine.toAfterScenarioStepDocStringState();
    this._machine.handle(event.source, session);
  }

  onDocStringTokenStop() {
    this._machine.toAfterScenarioStepDocStringState();
  }
}

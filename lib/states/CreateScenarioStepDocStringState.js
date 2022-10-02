import BaseState from './BaseState.js';
import { DocStringIndentStartEvent, DocStringIndentStopEvent, DocStringTokenStartEvent, DocStringTokenStopEvent, EndEvent, DocStringEvent } from '../events/index.js';

const events = [EndEvent, DocStringTokenStartEvent, DocStringIndentStartEvent, DocStringTokenStopEvent, DocStringIndentStopEvent, DocStringEvent];

export default class CreateScenarioStepDocStringState extends BaseState {
  constructor({ machine, specification }) {
    super({ machine, specification, events });
    this._specification = specification;
  }

  onDocString(event) {
    this._specification.createScenarioStepDocString({ ...event.data });
  }

  onDocStringIndentStop(event, session) {
    this._machine.toAfterScenarioStepDocStringState();
    this._machine.handle(event.source, session);
  }

  onDocStringTokenStop() {
    this._machine.toAfterScenarioStepDocStringState();
  }
};

import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const events = [
  Events.AnnotationEvent,
  Events.BackgroundEvent,
  Events.BlankLineEvent,
  Events.BlockCommentEvent,
  Events.DocStringTokenStartEvent,
  Events.DocStringTokenStopEvent,
  Events.DocStringIndentStartEvent,
  Events.DocStringIndentStopEvent,
  Events.EndEvent,
  Events.FeatureEvent,
  Events.ScenarioEvent,
  Events.SingleLineCommentEvent,
  Events.StepEvent,
];

const validEvents = [
  Events.AnnotationEvent,
  Events.BlankLineEvent,
  Events.BlockCommentEvent,
  Events.ScenarioEvent,
  Events.SingleLineCommentEvent,
  Events.StepEvent,
];

export default class AfterScenarioStepDocStringState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events, validEvents });
    this._featureBuilder = featureBuilder;
    this._annotations = [];
  }

  onAnnotation(event) {
    this._annotations.push({ ...event.data });
  }

  onBlankLine() {
    // Do nothing
  }

  onBlockComment() {
    this._machine.toConsumeBlockCommentState();
  }

  onScenario(event) {
    this._featureBuilder.createScenario({ annotations: this._annotations, ...event.data });
    this._machine.toCreateScenarioState();
  }

  onEnd() {
    this._machine.toFinalState();
  }

  onSingleLineComment() {
    // Do nothing
  }

  onStep(event) {
    this._featureBuilder.createScenarioStep({ annotations: this._annotations, ...event.data });
    this._machine.toAfterScenarioStepState();
  }
}

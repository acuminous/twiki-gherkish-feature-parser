import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const events = [
  Events.AnnotationEvent,
  Events.BackgroundEvent,
  Events.BlankLineEvent,
  Events.BlockCommentEvent,
  Events.DocStringTokenStartEvent,
  Events.DocStringIndentStartEvent,
  Events.DocStringTokenStopEvent,
  Events.DocStringIndentStopEvent,
  Events.FeatureEvent,
  Events.EndEvent,
  Events.ScenarioEvent,
  Events.SingleLineCommentEvent,
  Events.StepEvent,
];

export default class AfterBackgroundStepDocStringState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events });
    this._featureBuilder = featureBuilder;
    this._annotations = [];
  }

  getValidEvents() {
    return [
      Events.AnnotationEvent,
      Events.BlankLineEvent,
      Events.BlockCommentEvent,
      Events.ScenarioEvent,
      Events.SingleLineCommentEvent,
      Events.StepEvent,
    ];
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

  onSingleLineComment() {
    // Do nothing
  }

  onStep(event) {
    this._featureBuilder.createBackgroundStep({ annotations: this._annotations, ...event.data });
    this._machine.toAfterBackgroundStepState();
  }
}

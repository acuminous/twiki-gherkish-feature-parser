import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const events = [
  Events.AnnotationEvent,
  Events.BlankLineEvent,
  Events.BlockCommentEvent,
  Events.DocStringTokenStartEvent,
  Events.DocStringIndentStartEvent,
  Events.DocStringTokenStopEvent,
  Events.DocStringIndentStopEvent,
  Events.EndEvent,
  Events.FeatureEvent,
  Events.BackgroundEvent,
  Events.ScenarioEvent,
  Events.SingleLineCommentEvent,
  Events.StepEvent,
];

export default class AfterBackgroundStepState extends BaseState {

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
      Events.DocStringIndentStartEvent,
      Events.DocStringTokenStartEvent,
      Events.SingleLineCommentEvent,
      Events.ScenarioEvent,
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

  onDocStringIndentStart(event, session) {
    this._machine.toCreateBackgroundStepDocStringState(event);
    this._machine.handle(event.source, session);
  }

  onDocStringTokenStart(event) {
    this._machine.toCreateBackgroundStepDocStringState(event);
  }

  onSingleLineComment() {
    // Do nothing
  }

  onScenario(event) {
    this._featureBuilder.createScenario({ annotations: this._annotations, ...event.data });
    this._machine.toCreateScenarioState();
  }

  onStep(event) {
    this._featureBuilder.createBackgroundStep({ annotations: this._annotations, ...event.data });
    this._machine.toAfterBackgroundStepState();
  }
}

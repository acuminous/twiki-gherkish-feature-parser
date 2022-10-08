import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const events = [
  new Events.AnnotationEvent({ expected: true }),
  new Events.BackgroundEvent(),
  new Events.BlankLineEvent({ expected: true }),
  new Events.BlockCommentEvent({ expected: true }),
  new Events.ExplicitDocStringStartEvent(),
  new Events.ExplicitDocStringStopEvent(),
  new Events.ImplicitDocStringStartEvent(),
  new Events.ImplicitDocStringStopEvent(),
  new Events.EndEvent(),
  new Events.FeatureEvent(),
  new Events.ScenarioEvent({ expected: true }),
  new Events.SingleLineCommentEvent({ expected: true }),
  new Events.StepEvent({ expected: true }),
];

export default class AfterScenarioStepDocStringState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events });
    this._featureBuilder = featureBuilder;
    this._annotations = [];
  }

  onAnnotation(session, event) {
    this._annotations.push({ ...event.data });
  }

  onBlankLine() {
    // Do nothing
  }

  onBlockComment() {
    this._machine.toConsumeBlockCommentState();
  }

  onScenario(session, event) {
    this._featureBuilder.createScenario({ annotations: this._annotations, ...event.data });
    this._machine.toCreateScenarioState();
  }

  onEnd() {
    this._machine.toFinalState();
  }

  onSingleLineComment() {
    // Do nothing
  }

  onStep(session, event) {
    this._featureBuilder.createScenarioStep({ annotations: this._annotations, ...event.data });
    this._machine.toAfterScenarioStepState();
  }
}

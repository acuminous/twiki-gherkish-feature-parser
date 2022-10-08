import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const events = [
  new Events.AnnotationEvent({ expected: true }),
  new Events.BlankLineEvent({ expected: true }),
  new Events.BlockCommentEvent({ expected: true }),
  new Events.ExplicitDocStringStartEvent({ expected: true }),
  new Events.ImplicitDocStringStartEvent({ expected: true }),
  new Events.ExplicitDocStringStopEvent(),
  new Events.ImplicitDocStringStopEvent(),
  new Events.EndEvent(),
  new Events.FeatureEvent(),
  new Events.BackgroundEvent(),
  new Events.ScenarioEvent({ expected: true }),
  new Events.SingleLineCommentEvent({ expected: true }),
  new Events.StepEvent({ expected: true }),
];

export default class AfterBackgroundStepState extends BaseState {

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

  onImplicitDocStringStart(session, event) {
    this._machine.toCreateBackgroundStepImplicitDocStringState(event);
    this._machine.handle(event.source, session);
  }

  onExplicitDocStringStart(session, event) {
    this._machine.toCreateBackgroundStepExplicitDocStringState(event);
  }

  onSingleLineComment() {
    // Do nothing
  }

  onScenario(session, event) {
    this._featureBuilder.createScenario({ annotations: this._annotations, ...event.data });
    this._machine.toCreateScenarioState();
  }

  onStep(session, event) {
    this._featureBuilder.createBackgroundStep({ annotations: this._annotations, ...event.data });
    this._machine.toAfterBackgroundStepState();
  }
}

import Debug from 'debug';
import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:AfterBackgroundStepDocStringState');

const events = [
  new Events.AnnotationEvent({ expected: true }),
  new Events.BackgroundEvent(),
  new Events.BlankLineEvent({ expected: true }),
  new Events.BlockCommentEvent({ expected: true }),
  new Events.ExplicitDocStringStartEvent(),
  new Events.ImplicitDocStringStartEvent(),
  new Events.ExplicitDocStringStopEvent(),
  new Events.ImplicitDocStringStopEvent(),
  new Events.FeatureEvent(),
  new Events.EndEvent(),
  new Events.ScenarioEvent({ expected: true }),
  new Events.SingleLineCommentEvent({ expected: true }),
  new Events.StepEvent({ expected: true }),
];

export default class AfterBackgroundStepDocStringState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events, debug });
    this._featureBuilder = featureBuilder;
  }

  onAnnotation(session, event, context) {
    this._featureBuilder.stashAnnotation(context.data);
  }

  onBlankLine() {
    // Do nothing
  }

  onBlockComment() {
    this._machine.toConsumeBlockCommentState();
  }

  onScenario(session, event, context) {
    this._featureBuilder.createScenario({ annotations: this._annotations, ...context.data });
    this._machine.toScenarioState();
  }

  onSingleLineComment() {
    // Do nothing
  }

  onStep(session, event, context) {
    this._featureBuilder.createBackgroundStep({ annotations: this._annotations, ...context.data });
    this._machine.toBackgroundStepsState();
  }
}

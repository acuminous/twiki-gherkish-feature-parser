import Debug from 'debug';
import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:AfterScenarioStepDocStringState');

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
    super({ machine, events, debug });
    this._featureBuilder = featureBuilder;
    this._annotations = [];
  }

  onAnnotation(session, event, context) {
    this._annotations.push({ ...context.data });
  }

  onBlankLine() {
    // Do nothing
  }

  onBlockComment() {
    this._machine.toBlockCommentState();
  }

  onScenario(session, event, context) {
    this._featureBuilder.createScenario({ annotations: this._annotations, ...context.data });
    this._machine.toScenarioState();
  }

  onEnd() {
    this._machine.toFinalState();
  }

  onSingleLineComment() {
    // Do nothing
  }

  onStep(session, event, context) {
    this._featureBuilder.createScenarioStep({ annotations: this._annotations, ...context.data });
    this._machine.toScenarioStepsState();
  }
}

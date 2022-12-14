import BaseState from './BaseState.js';
import EndFeatureBackgroundStepDocstringState from './EndFeatureBackgroundStepDocstringState.js';
import EndFeatureBackgroundStepAnnotationState from './EndFeatureBackgroundStepAnnotationState.js';
import * as Events from '../events/index.js';

const events = [
  new Events.AnnotationEvent({ expected: true }),
  new Events.BackgroundEvent(),
  new Events.BlankLineEvent({ expected: true }),
  new Events.BlockCommentDelimiterEvent({ expected: true }),
  new Events.EndEvent(),
  new Events.ExampleTableEvent(),
  new Events.ExplicitDocstringStartEvent({ expected: true }),
  new Events.ExplicitDocstringStopEvent(),
  new Events.FeatureEvent(),
  new Events.ImplicitDocstringStartEvent({ expected: true }),
  new Events.ImplicitDocstringStopEvent(),
  new Events.RuleEvent({ expected: true }),
  new Events.ScenarioEvent({ expected: true }),
  new Events.SingleLineCommentEvent({ expected: true }),
  new Events.StepEvent({ expected: true }),
];

export default class CaptureFeatureBackgroundStepState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, featureBuilder, events });
  }

  onAnnotation(session, event, context) {
    this._machine.checkpoint().alias(EndFeatureBackgroundStepAnnotationState).toCaptureAnnotationState().dispatch(event, context);
  }

  onBlankLine() {
    this._machine.noop();
  }

  onBlockCommentDelimiter() {
    this._machine.checkpoint().toConsumeBlockCommentState();
  }

  onExplicitDocstringStart() {
    this._machine.checkpoint().alias(EndFeatureBackgroundStepDocstringState).toBeginExplicitDocstringState();
  }

  onImplicitDocstringStart(session, event, context) {
    this._machine.checkpoint().alias(EndFeatureBackgroundStepDocstringState).toCaptureImplicitDocstringState().interpret(context.source);
  }

  onRule(session, event, context) {
    this._featureBuilder.createRule(context.data);
    this._machine.toDeclareRuleState();
  }

  onScenario(session, event, context) {
    this._featureBuilder.createScenario(context.data);
    this._machine.toDeclareScenarioState();
  }

  onSingleLineComment() {
    this._machine.noop();
  }

  onStep(session, event, context) {
    this._featureBuilder.createStep(context.data);
  }
}

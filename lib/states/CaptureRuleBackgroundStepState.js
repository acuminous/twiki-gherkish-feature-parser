import Debug from 'debug';
import BaseState from './BaseState.js';
import EndRuleBackgroundStepDocstringState from './EndRuleBackgroundStepDocstringState.js';
import EndRuleBackgroundStepAnnotationState from './EndRuleBackgroundStepAnnotationState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:CaptureRuleBackgroundStepState');

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
  new Events.RuleEvent(),
  new Events.ScenarioEvent({ expected: true }),
  new Events.SingleLineCommentEvent({ expected: true }),
  new Events.StepEvent({ expected: true }),
];

export default class CaptureRuleBackgroundStepState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, featureBuilder, events, debug });
  }

  onAnnotation(session, event, context) {
    this._machine.checkpoint().alias(EndRuleBackgroundStepAnnotationState).toCaptureAnnotationState().dispatch(event, context);
  }

  onBlankLine() {
    this._machine.noop();
  }

  onBlockCommentDelimiter() {
    this._machine.checkpoint().toConsumeBlockCommentState();
  }

  onExplicitDocstringStart() {
    this._machine.checkpoint().alias(EndRuleBackgroundStepDocstringState).toBeginExplicitDocstringState();
  }

  onImplicitDocstringStart(session, event, context) {
    this._machine.checkpoint().alias(EndRuleBackgroundStepDocstringState).toCaptureImplicitDocstringState().interpret(context.source);
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

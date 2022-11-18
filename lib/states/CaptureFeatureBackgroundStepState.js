import Debug from 'debug';
import BaseState from './BaseState.js';
import EndFeatureBackgroundDocstringState from './EndFeatureBackgroundDocstringState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:CaptureFeatureBackgroundStepState');

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
    super({ machine, events, debug });
    this._featureBuilder = featureBuilder;
  }

  onAnnotation(session, event, context) {
    this._machine.checkpoint().toCaptureAnnotationState().dispatch(event, context);
  }

  onBlankLine() {
    this._machine.noop();
  }

  onBlockCommentDelimiter() {
    this._machine.checkpoint().toConsumeBlockCommentState();
  }

  onExplicitDocstringStart() {
    this._machine.checkpoint().alias(EndFeatureBackgroundDocstringState).toBeginExplicitDocstringState();
  }

  onImplicitDocstringStart(session, event, context) {
    this._machine.checkpoint().alias(EndFeatureBackgroundDocstringState).toCaptureImplicitDocstringState().interpret(context.source);
  }

  onRule(session, event, context) {
    this._featureBuilder.createRule(context.data);
    this._machine.toDeclareRuleState();
  }

  onSingleLineComment() {
    this._machine.noop();
  }

  onScenario(session, event, context) {
    this._featureBuilder.createScenario(context.data);
    this._machine.toDeclareScenarioState();
  }

  onStep(session, event, context) {
    this._featureBuilder.createStep(context.data);
  }
}

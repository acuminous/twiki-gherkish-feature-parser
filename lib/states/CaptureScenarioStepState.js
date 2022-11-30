import Debug from 'debug';
import BaseState from './BaseState.js';
import EndScenarioStepAnnotationState from './EndScenarioStepAnnotationState.js';
import EndScenarioStepDocstringState from './EndScenarioStepDocstringState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:CaptureScenarioStepState');

const events = [
  new Events.AnnotationEvent({ expected: true }),
  new Events.BackgroundEvent(),
  new Events.BlankLineEvent({ expected: true }),
  new Events.BlockCommentDelimiterEvent({ expected: true }),
  new Events.EndEvent({ expected: true }),
  new Events.ExampleTableEvent({ expected: true }),
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

export default class CaptureScenarioStepState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, featureBuilder, events, debug });
  }

  onAnnotation(session, event, context) {
    this._machine.checkpoint().alias(EndScenarioStepAnnotationState).toCaptureAnnotationState().dispatch(event, context);
  }

  onBlankLine() {
    this._machine.noop();
  }

  onBlockCommentDelimiter() {
    this._machine.checkpoint().toConsumeBlockCommentState();
  }

  onEnd() {
    this._machine.toFinalState();
  }

  onExampleTable() {
    this._machine.checkpoint().toDeclareExampleTableState();
  }

  onExplicitDocstringStart() {
    this._machine.checkpoint().alias(EndScenarioStepDocstringState).toBeginExplicitDocstringState();
  }

  onImplicitDocstringStart(session, event, context) {
    this._machine.checkpoint().alias(EndScenarioStepDocstringState).toCaptureImplicitDocstringState().interpret(context.source);
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

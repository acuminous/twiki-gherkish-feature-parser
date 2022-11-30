import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const events = [
  new Events.AnnotationEvent({ expected: true }),
  new Events.BackgroundEvent(),
  new Events.BlankLineEvent({ expected: true }),
  new Events.BlockCommentDelimiterEvent({ expected: true }),
  new Events.ExampleTableEvent(),
  new Events.ExplicitDocstringStartEvent(),
  new Events.ImplicitDocstringStartEvent(),
  new Events.ExplicitDocstringStopEvent(),
  new Events.ImplicitDocstringStopEvent(),
  new Events.EndEvent(),
  new Events.FeatureEvent(),
  new Events.RuleEvent(),
  new Events.SingleLineCommentEvent({ expected: true }),
  new Events.ScenarioEvent(),
  new Events.StepEvent({ expected: true }),
];

export default class DeclareRuleBackgroundState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, featureBuilder, events });
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

  onSingleLineComment() {
    this._machine.noop();
  }

  onStep(session, event, context) {
    this._machine.toCaptureRuleBackgroundStepState().dispatch(event, context);
  }
}

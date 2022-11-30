import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const events = [
  new Events.AnnotationEvent({ expected: true }),
  new Events.BackgroundEvent({ expected: true }),
  new Events.BlankLineEvent({ expected: true }),
  new Events.BlockCommentDelimiterEvent({ expected: true }),
  new Events.ExampleTableEvent(),
  new Events.ExplicitDocstringStartEvent(),
  new Events.EndEvent(),
  new Events.RuleEvent(),
  new Events.FeatureEvent(),
  new Events.SingleLineCommentEvent({ expected: true }),
  new Events.ScenarioEvent({ expected: true }),
  new Events.TextEvent({ expected: true }),
];

export default class DeclareRuleState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, featureBuilder, events });
  }

  onAnnotation(session, event, context) {
    this._machine.checkpoint().toCaptureAnnotationState().dispatch(event, context);
  }

  onBackground(session, event, context) {
    this._featureBuilder.createBackground(context.data);
    this._machine.toDeclareRuleBackgroundState();
  }

  onBlankLine() {
    this._machine.noop();
  }

  onBlockCommentDelimiter() {
    this._machine.checkpoint().toConsumeBlockCommentState();
  }

  onScenario(session, event, context) {
    this._featureBuilder.createScenario(context.data);
    this._machine.toDeclareScenarioState();
  }

  onSingleLineComment() {
    this._machine.noop();
  }

  onText(session, event, context) {
    this._featureBuilder.createDescription(context.data);
  }
}

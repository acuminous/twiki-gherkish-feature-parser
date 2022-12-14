import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const events = [
  new Events.AnnotationEvent({ expected: true }),
  new Events.BackgroundEvent(),
  new Events.BlankLineEvent({ expected: true }),
  new Events.BlockCommentDelimiterEvent({ expected: true }),
  new Events.EndEvent(),
  new Events.ExampleTableEvent(),
  new Events.ExplicitDocstringStartEvent(),
  new Events.FeatureEvent(),
  new Events.ImplicitDocstringStartEvent(),
  new Events.RuleEvent(),
  new Events.ScenarioEvent({ expected: true }),
  new Events.SingleLineCommentEvent({ expected: true }),
  new Events.StepEvent({ expected: true }),
];

export default class EndRuleBackgroundStepAnnotationState extends BaseState {

  static alias = 'EndAnnotationState';

  constructor({ machine, featureBuilder }) {
    super({ machine, featureBuilder, events });
  }

  onAnnotation(session, event, context) {
    this._featureBuilder.stashAnnotation(context.data);
  }

  onBlankLine(session, event, context) {
    this._machine.unwind().dispatch(event, context);
  }

  onBlockCommentDelimiter(session, event, context) {
    this._machine.unwind().dispatch(event, context);
  }

  onScenario(session, event, context) {
    this._machine.unwind().dispatch(event, context);
  }

  onSingleLineComment(session, event, context) {
    this._machine.unwind().dispatch(event, context);
  }

  onStep(session, event, context) {
    this._machine.unwind().dispatch(event, context);
  }
}

import Debug from 'debug';
import BaseEndDocstringState from './BaseEndDocstringState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:EndRuleBackgroundStepDocstringState');

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

export default class EndRuleBackgroundStepDocstringState extends BaseEndDocstringState {

  constructor({ machine }) {
    super({ machine, events, debug });
  }

  onAnnotation(session, event, context) {
    this._machine.unwind().dispatch(event, context);
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
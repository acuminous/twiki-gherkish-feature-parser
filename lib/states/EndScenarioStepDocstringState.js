import Debug from 'debug';
import BaseEndDocstringState from './BaseEndDocstringState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:EndScenarioStepDocstringState');

const events = [
  new Events.AnnotationEvent({ expected: true }),
  new Events.BackgroundEvent(),
  new Events.BlankLineEvent({ expected: true }),
  new Events.BlockCommentDelimiterEvent({ expected: true }),
  new Events.EndEvent({ expected: true }),
  new Events.ExampleTableEvent({ expected: true }),
  new Events.ExplicitDocstringStartEvent(),
  new Events.FeatureEvent(),
  new Events.ImplicitDocstringStartEvent(),
  new Events.RuleEvent({ expected: true }),
  new Events.ScenarioEvent({ expected: true }),
  new Events.SingleLineCommentEvent({ expected: true }),
  new Events.StepEvent({ expected: true }),
];

export default class EndScenarioStepDocstringState extends BaseEndDocstringState {

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

  onEnd(session, event, context) {
    this._machine.unwind().dispatch(event, context);
  }

  onExampleTable(session, event, context) {
    this._machine.unwind().dispatch(event, context);
  }

  onRule(session, event, context) {
    this._machine.unwind().dispatch(event, context);
  }

  onSingleLineComment(session, event, context) {
    this._machine.unwind().dispatch(event, context);
  }

  onScenario(session, event, context) {
    this._machine.unwind().dispatch(event, context);
  }

  onStep(session, event, context) {
    this._machine.unwind().dispatch(event, context);
  }
}

import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const events = [
  new Events.AnnotationEvent(),
  new Events.BackgroundEvent(),
  new Events.BlankLineEvent({ expected: true }),
  new Events.BlockCommentDelimiterEvent({ expected: true }),
  new Events.ExampleTableEvent(),
  new Events.ExampleTableHeaderRowEvent({ expected: true }),
  new Events.ExampleTableSeparatorRowEvent(),
  new Events.ExplicitDocstringStartEvent(),
  new Events.ImplicitDocstringStartEvent(),
  new Events.ExplicitDocstringStopEvent(),
  new Events.ImplicitDocstringStopEvent(),
  new Events.EndEvent(),
  new Events.FeatureEvent(),
  new Events.RuleEvent(),
  new Events.SingleLineCommentEvent({ expected: true }),
  new Events.ScenarioEvent(),
  new Events.StepEvent(),
];

export default class DeclareExampleTableState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, featureBuilder, events });
  }

  onBlankLine() {
    this._machine.noop();
  }

  onBlockCommentDelimiter() {
    this._machine.checkpoint().toConsumeBlockCommentState();
  }

  onExampleTableHeaderRow(session, event, context) {
    this._featureBuilder.createExampleTable(context.data);
    this._machine.toCaptureExampleTableHeadingsState();
  }

  onSingleLineComment() {
    this._machine.noop();
  }
}

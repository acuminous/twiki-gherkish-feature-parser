import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const events = [
  new Events.AnnotationEvent(),
  new Events.BackgroundEvent(),
  new Events.BlankLineEvent(),
  new Events.BlockCommentDelimiterEvent(),
  new Events.EndEvent(),
  new Events.ExampleTableEvent(),
  new Events.ExampleTableSeparatorRowEvent({ expected: true }),
  new Events.ExampleTableDataRowEvent(),
  new Events.ExplicitDocstringStartEvent(),
  new Events.FeatureEvent(),
  new Events.ImplicitDocstringStartEvent(),
  new Events.RuleEvent(),
  new Events.ScenarioEvent(),
  new Events.SingleLineCommentEvent(),
  new Events.StepEvent(),
];

export default class CaptureExampleTableHeadingsState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, featureBuilder, events });
  }

  onExampleTableSeparatorRow() {
    this._machine.toConsumeExampleTableSeparatorRowState();
  }
}

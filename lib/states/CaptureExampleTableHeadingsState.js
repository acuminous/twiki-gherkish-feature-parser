import Debug from 'debug';
import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:CaptureExampleTableHeadingsState');

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
  new Events.ExplicitDocstringStopEvent(),
  new Events.FeatureEvent(),
  new Events.ImplicitDocstringStartEvent(),
  new Events.ImplicitDocstringStopEvent(),
  new Events.RuleEvent(),
  new Events.ScenarioEvent(),
  new Events.SingleLineCommentEvent(),
  new Events.StepEvent(),
];

export default class CaptureExampleTableHeadingsState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events, debug });
    this._featureBuilder = featureBuilder;
  }

  onExampleTableSeparatorRow() {
    this._machine.toConsumeExampleTableSeparatorRowState();
  }
}

import Debug from 'debug';
import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:ConsumeExampleTableSeparatorRowState');

const events = [
  new Events.AnnotationEvent({ expected: true }),
  new Events.BackgroundEvent(),
  new Events.BlankLineEvent(),
  new Events.BlockCommentDelimiterEvent(),
  new Events.DocstringTextEvent(),
  new Events.EndEvent(),
  new Events.ExampleTableDataRowEvent({ expected: true }),
  new Events.ExampleTableEvent(),
  new Events.ExampleTableHeaderRowEvent(),
  new Events.ExampleTableSeparatorRowEvent(),
  new Events.ExplicitDocstringStartEvent(),
  new Events.ExplicitDocstringStopEvent(),
  new Events.FeatureEvent(),
  new Events.ImplicitDocstringStartEvent(),
  new Events.ImplicitDocstringStopEvent(),
  new Events.MissingEventHandlerEvent(),
  new Events.RuleEvent(),
  new Events.ScenarioEvent(),
  new Events.SingleLineCommentEvent(),
  new Events.StepEvent(),
];

export default class ConsumeExampleTableSeparatorRowState extends BaseState {

  constructor({ machine }) {
    super({ machine, events, debug });
  }

  onAnnotation(session, event, context) {
    this._machine.checkpoint().toCaptureAnnotationState().dispatch(event, context);
  }

  onExampleTableDataRow(session, event, context) {
    this._machine.toCaptureExampleTableExampleState().dispatch(event, context);
  }
}
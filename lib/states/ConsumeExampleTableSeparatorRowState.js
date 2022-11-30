import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const events = [
  new Events.AnnotationEvent({ expected: true }),
  new Events.BackgroundEvent(),
  new Events.BlankLineEvent(),
  new Events.BlockCommentDelimiterEvent(),
  new Events.DocstringTextEvent(),
  new Events.EndEvent(),
  new Events.ExampleTableEvent(),
  new Events.ExampleTableSeparatorRowEvent(),
  new Events.ExampleTableDataRowEvent({ expected: true }),
  new Events.ExampleTableHeaderRowEvent(),
  new Events.ExplicitDocstringStartEvent(),
  new Events.FeatureEvent(),
  new Events.ImplicitDocstringStartEvent(),
  new Events.RuleEvent(),
  new Events.ScenarioEvent(),
  new Events.SingleLineCommentEvent(),
  new Events.StepEvent(),
];

export default class ConsumeExampleTableSeparatorRowState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, featureBuilder, events });
  }

  onAnnotation(session, event, context) {
    this._machine.checkpoint().toCaptureAnnotationState().dispatch(event, context);
  }

  onExampleTableDataRow(session, event, context) {
    this._machine.toCaptureExampleTableExampleState().dispatch(event, context);
  }
}

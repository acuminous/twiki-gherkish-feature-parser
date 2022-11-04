import Debug from 'debug';
import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:DeclareExampleTableState');

const events = [
  new Events.AnnotationEvent({ expected: true }),
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
  new Events.SingleLineCommentEvent({ expected: true }),
  new Events.ScenarioEvent(),
  new Events.StepEvent(),
];

export default class DeclareExampleTableState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events, debug });
    this._featureBuilder = featureBuilder;
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

  onExampleTableHeaderRow() {
  }

  onSingleLineComment() {
    this._machine.noop();
  }
}

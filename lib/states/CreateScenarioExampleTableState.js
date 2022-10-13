import Debug from 'debug';
import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:CreateScenarioExampleTableState');

const events = [
  new Events.AnnotationEvent({ expected: true }),
  new Events.BackgroundEvent(),
  new Events.BlankLineEvent({ expected: true }),
  new Events.BlockCommentEvent({ expected: true }),
  new Events.ExplicitDocStringStartEvent(),
  new Events.ImplicitDocStringStartEvent(),
  new Events.ExplicitDocStringStopEvent(),
  new Events.ImplicitDocStringStopEvent(),
  new Events.EndEvent(),
  new Events.FeatureEvent(),
  new Events.ScenarioEvent(),
  new Events.SingleLineCommentEvent({ expected: true }),
  new Events.ExampleTableHeaderRowEvent({ expected: true }),
  new Events.TextEvent(),
];

export default class CreateScenarioExampleTableState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events, debug });
    this._featureBuilder = featureBuilder;
    this._annotations = [];
  }

  onAnnotation(session, event) {
    this._annotations.push({ ...event.data });
  }

  onBlankLine() {
    // Do nothing
  }

  onBlockComment() {
    this._machine.toConsumeBlockCommentState();
  }

  onSingleLineComment() {
    // Do nothing
  }

  onExampleTableHeaderRow(session, event) {
    this._featureBuilder.createScenarioExampleTableRow({ annotations: this._annotations, ...event.data });
    this._machine.toAfterScenarioExampleTableHeaderRowState();
  }
}
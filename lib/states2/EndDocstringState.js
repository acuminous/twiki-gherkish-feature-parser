import Debug from 'debug';
import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:EndDocstringState');

const events = [
  new Events.AnnotationEvent({ expected: true }),
  new Events.BackgroundEvent({ expected: true }),
  new Events.BlankLineEvent({ expected: true }),
  new Events.BlockCommentDelimiterEvent({ expected: true }),
  new Events.EndEvent({ expected: true }),
  new Events.ExampleTableEvent({ expected: true }),
  new Events.ExplicitDocStringStartEvent({ expected: true }),
  new Events.SingleLineCommentEvent({ expected: true }),
  new Events.ScenarioEvent({ expected: true }),
  new Events.StepEvent({ expected: true }),
];

export default class EndDocstringState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events, debug });
    this._featureBuilder = featureBuilder;
  }

  onAnnotation(session, event, context) {
    this._machine.toPreviousCheckpoint()
      .dispatch(event, context);
  }

  onBackground(session, event, context) {
    this._machine.toPreviousCheckpoint()
      .dispatch(event, context);
  }

  onBlankLine(session, event, context) {
    this._machine.toPreviousCheckpoint()
      .dispatch(event, context);
  }

  onBlockCommentDelimiter(session, event, context) {
    this._machine.toPreviousCheckpoint()
      .dispatch(event, context);
  }

  onEnd(session, event, context) {
    this._machine.toPreviousCheckpoint()
      .dispatch(event, context);
  }

  onExplicitDocStringStart(session, event, context) {
    this._machine.toPreviousCheckpoint()
      .dispatch(event, context);
  }

  onExampleTable(session, event, context) {
    this._machine.toPreviousCheckpoint()
      .dispatch(event, context);
  }

  onSingleLineComment(session, event, context) {
    this._machine.toPreviousCheckpoint()
      .dispatch(event, context);
  }

  onScenario(session, event, context) {
    this._machine.toPreviousCheckpoint()
      .dispatch(event, context);
  }

  onStep(session, event, context) {
    this._machine.toPreviousCheckpoint()
      .dispatch(event, context);
  }

}
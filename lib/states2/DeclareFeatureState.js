import Debug from 'debug';
import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:DeclareFeatureState');

const events = [
  new Events.AnnotationEvent({ expected: true }),
  new Events.BackgroundEvent({ expected: true }),
  new Events.BlankLineEvent({ expected: true }),
  new Events.BlockCommentEvent({ expected: true }),
  new Events.ExampleTableEvent(),
  new Events.ExplicitDocStringStartEvent(),
  new Events.ExplicitDocStringStopEvent(),
  new Events.EndEvent(),
  new Events.FeatureEvent(),
  new Events.SingleLineCommentEvent({ expected: true }),
  new Events.ScenarioEvent({ expected: true }),
  new Events.TextEvent({ expected: true }),
];

export default class DeclareFeatureState extends BaseState {

  constructor({ machine, featureBuilder }) {
    super({ machine, events, debug });
    this._featureBuilder = featureBuilder;
  }

  onAnnotation(session, event, context) {
    this._featureBuilder.stashAnnotation(context.data);
  }

  onBackground(session, event, context) {
    this._featureBuilder.createBackground({ annotations: this._annotations, ...context.data });
    this._machine.toDeclareBackgroundState();
  }

  onBlankLine() {
    // Do nothing
  }

  onBlockComment() {
    this._machine.toBlockCommentState();
  }

  onScenario(session, event, context) {
    this._featureBuilder.createScenario({ annotations: this._annotations, ...context.data });
    this._machine.toScenarioState();
  }

  onSingleLineComment() {
    // Do nothing
  }

  onText(session, event, context) {
    this._featureBuilder.describeFeature({ ...context.data });
  }
}

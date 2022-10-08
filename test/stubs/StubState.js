import { States, Events } from '../../lib/index.js';

const { BaseState } = States;
const { AnnotationEvent, BackgroundEvent, BlankLineEvent, ExplicitDocStringStartEvent, EndEvent, FeatureEvent, BlockCommentEvent, ScenarioEvent, SingleLineCommentEvent, StepEvent, TextEvent } = Events;

export default class StubState extends BaseState {
  constructor(assertions = []) {
    super({ events: [EndEvent, ExplicitDocStringStartEvent, BlockCommentEvent, SingleLineCommentEvent, AnnotationEvent, FeatureEvent, BackgroundEvent, ScenarioEvent, BlankLineEvent, StepEvent, TextEvent] });
    this.count = 0;
    this.assertions = [].concat(assertions);
  }

  onAnnotation(session, event) {
    return this.handleEvent(event);
  }

  onBackground(session, event) {
    return this.handleEvent(event);
  }

  onBlankLine(session, event) {
    return this.handleEvent(event);
  }

  onExplicitDocStringStart(session, event) {
    return this.handleEvent(event);
  }

  onImplicitDocStringStart(session, event) {
    return this.handleEvent(event);
  }

  onDocStringText(session, event) {
    return this.handleEvent(event);
  }

  onExplicitDocStringStop(session, event) {
    return this.handleEvent(event);
  }

  onImplicitDocStringStop(session, event) {
    return this.handleEvent(event);
  }

  onEnd(session, event) {
    return this.handleEvent(event);
  }

  onFeature(session, event) {
    return this.handleEvent(event);
  }

  onLanguage(event) {
    return this.handleEvent(event);
  }

  onBlockComment(session, event) {
    return this.handleEvent(event);
  }

  onScenario(session, event) {
    return this.handleEvent(event);
  }

  onSingleLineComment(session, event) {
    return this.handleEvent(event);
  }

  onStep(session, event) {
    return this.handleEvent(event);
  }

  onText(session, event) {
    return this.handleEvent(event);
  }

  onMissingEventHandler(session, event) {
    return this.handleEvent(event);
  }

  handleEvent(event) {
    if (this.assertions[this.count]) this.assertions[this.count](event);
    this.count++;
    return this;
  }
}

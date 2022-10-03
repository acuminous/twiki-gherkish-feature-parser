import { States, Events } from '../../lib/index.js';

const { BaseState } = States;
const { AnnotationEvent, BackgroundEvent, BlankLineEvent, DocStringTokenStartEvent, EndEvent, FeatureEvent, BlockCommentEvent, ScenarioEvent, SingleLineCommentEvent, StepEvent, TextEvent } = Events;

export default class StubState extends BaseState {
  constructor(assertions = []) {
    super({ events: [EndEvent, DocStringTokenStartEvent, BlockCommentEvent, SingleLineCommentEvent, AnnotationEvent, FeatureEvent, BackgroundEvent, ScenarioEvent, BlankLineEvent, StepEvent, TextEvent] });
    this.count = 0;
    this.assertions = [].concat(assertions);
  }

  onAnnotation(event) {
    return this.handleEvent(event);
  }

  onBackground(event) {
    return this.handleEvent(event);
  }

  onBlankLine(event) {
    return this.handleEvent(event);
  }

  onDocStringTokenStart(event) {
    return this.handleEvent(event);
  }

  onDocStringIndentStart(event) {
    return this.handleEvent(event);
  }

  onDocString(event) {
    return this.handleEvent(event);
  }

  onDocStringTokenStop(event) {
    return this.handleEvent(event);
  }

  onDocStringIndentStop(event) {
    return this.handleEvent(event);
  }

  onEnd(event) {
    return this.handleEvent(event);
  }

  onFeature(event) {
    return this.handleEvent(event);
  }

  onLanguage(event) {
    return this.handleEvent(event);
  }

  onBlockComment(event) {
    return this.handleEvent(event);
  }

  onScenario(event) {
    return this.handleEvent(event);
  }

  onSingleLineComment(event) {
    return this.handleEvent(event);
  }

  onStep(event) {
    return this.handleEvent(event);
  }

  onText(event) {
    return this.handleEvent(event);
  }

  onUnexpectedEvent(event) {
    return this.handleEvent(event);
  }

  handleEvent(event) {
    if (this.assertions[this.count]) this.assertions[this.count](event);
    this.count++;
    return this;
  }
}

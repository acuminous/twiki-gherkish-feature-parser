import Debug from 'debug';
import os from 'node:os';

export default class FeatureBuilder {
  constructor(props = {}) {
    const { debug = Debug('yadda:gherkish:FeatureBuilder') } = props;

    this._feature = undefined;
    this._debug = debug;
  }

  createFeature({ annotations, title }) {
    this._feature = {
      annotations,
      title,
      background: {
        annotations: [],
        steps: [],
      },
      scenarios: [],
    };
    return this;
  }

  describeFeature({ text }) {
    this._feature.description = this._feature.description ? `${this._feature.description}\n${text}` : text;
  }

  createBackground({ annotations, title }) {
    this._feature.background = { annotations, title, steps: [] };
  }

  createBackgroundStep({ annotations, text, generalised = text }) {
    this._feature.background.steps.push({ annotations, text, generalised, docString: [] });
  }

  createBackgroundStepDocString({ text }) {
    this._currentBackgroundStep().docString.push(text);
  }

  createScenario({ annotations, title }) {
    const scenario = { annotations, title, steps: [] };
    this._feature.scenarios.push(scenario);
  }

  createScenarioStep({ annotations, text, generalised = text }) {
    const scenario = this._currentScenario();
    scenario.steps.push({ annotations, text, generalised, docString: [] });
  }

  createScenarioStepDocString({ text }) {
    this._currentScenarioStep().docString.push(text);
  }

  _currentBackgroundStep() {
    const background = this._feature.background;
    return background.steps[background.steps.length - 1];
  }

  _currentScenario() {
    return this._feature.scenarios[this._feature.scenarios.length - 1];
  }

  _currentScenarioStep() {
    const scenario = this._currentScenario();
    return scenario.steps[scenario.steps.length - 1];
  }

  serialize() {
    return this.serialise();
  }

  serialise() {
    return this._feature ? this._serialiseFeature(this._feature) : undefined;
  }

  _serialiseFeature(feature) {
    return {
      annotations: feature.annotations.map((annotation) => this._serialiseAnnotation(annotation)),
      title: feature.title,
      description: feature.description || null,
      background: this._serialiseScenario(feature.background),
      scenarios: feature.scenarios.map((scenario) => this._serialiseScenario(scenario)),
    };
  }

  _serialiseAnnotation(annotation) {
    return { ...annotation };
  }

  _serialiseScenario(scenario) {
    return {
      title: scenario.title,
      description: scenario.description || null,
      annotations: scenario.annotations.map((annotation) => this._serialiseAnnotation(annotation)),
      steps: scenario.steps.map((step) => this._serialiseStep(step)),
    };
  }

  _serialiseStep(step) {
    return {
      annotations: step.annotations.map((annotation) => this._serialiseAnnotation(annotation)),
      text: step.text,
      generalised: step.generalised,
      docString: step.docString.join(os.EOL),
    };
  }
}

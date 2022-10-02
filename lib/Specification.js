import Debug from 'debug';
import os from 'node:os';

export default class Specification {
  constructor(props = {}) {
    const { debug = Debug('yadda:gherkish:Specification') } = props;

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
    return this._feature ? Specification._serialiseFeature(this._feature) : undefined;
  }

  static _serialiseFeature(feature) {
    return {
      annotations: feature.annotations.map(Specification._serialiseAnnotation),
      title: feature.title,
      description: feature.description,
      background: Specification._serialiseScenario(feature.background),
      scenarios: feature.scenarios.map(Specification._serialiseScenario),
    };
  }

  static _serialiseAnnotation(annotation) {
    return { ...annotation };
  }

  static _serialiseScenario(scenario) {
    return {
      title: scenario.title,
      description: scenario.description,
      annotations: scenario.annotations.map(Specification._serialiseAnnotation),
      steps: scenario.steps.map(Specification._serialiseStep),
    };
  }

  static _serialiseStep(step) {
    return {
      annotations: step.annotations.map(Specification._serialiseAnnotation),
      text: step.text,
      generalised: step.generalised,
      docString: step.docString.join(os.EOL),
    };
  }
};

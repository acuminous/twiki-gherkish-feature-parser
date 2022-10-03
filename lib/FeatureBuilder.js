import Debug from 'debug';
import os from 'node:os';

export default class FeatureBuilder {
  constructor(props = {}) {
    const { debug = Debug('twiki-bdd:gherkish-feature-parser:FeatureBuilder') } = props;

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

  createBackgroundStep({ annotations, text }) {
    this._feature.background.steps.push({ annotations, text, docString: [] });
  }

  createBackgroundStepDocString({ text }) {
    this._currentBackgroundStep().docString.push(text);
  }

  createScenario({ annotations, title }) {
    const scenario = { annotations, title, steps: [] };
    this._feature.scenarios.push(scenario);
  }

  createScenarioStep({ annotations, text }) {
    const scenario = this._currentScenario();
    scenario.steps.push({ annotations, text, docString: [] });
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

  build() {
    return this._feature ? this._buildFeature(this._feature) : undefined;
  }

  _buildFeature(feature) {
    return {
      annotations: feature.annotations.map((annotation) => this._buildAnnotation(annotation)),
      title: feature.title,
      description: feature.description || null,
      background: this._buildScenario(feature.background),
      scenarios: feature.scenarios.map((scenario) => this._buildScenario(scenario)),
    };
  }

  _buildAnnotation(annotation) {
    return { ...annotation };
  }

  _buildScenario(scenario) {
    return {
      title: scenario.title,
      description: scenario.description || null,
      annotations: scenario.annotations.map((annotation) => this._buildAnnotation(annotation)),
      steps: scenario.steps.map((step) => this._buildStep(step)),
    };
  }

  _buildStep(step) {
    return {
      annotations: step.annotations.map((annotation) => this._buildAnnotation(annotation)),
      text: step.text,
      docString: step.docString.join(os.EOL),
    };
  }
}

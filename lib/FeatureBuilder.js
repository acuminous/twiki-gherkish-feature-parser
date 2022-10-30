import Debug from 'debug';
import os from 'node:os';

const debug = Debug('twiki:gherkish-feature-parser:FeatureBuilder');

export default class FeatureBuilder {

  constructor() {
    this._feature = undefined;
    this._annotations = [];
  }

  stashAnnotation(annotation) {
    this._annotations.push(annotation);
    return this;
  }

  createFeature({ title }) {
    this._feature = {
      annotations: this._annotations,
      title,
      scenarios: [],
    };
    this._annotations = [];
    return this;
  }

  describeFeature({ text }) {
    this._feature.description = this._feature.description ? `${this._feature.description}\n${text}` : text;
    return this;
  }

  createBackground({ title }) {
    this._feature.background = {
      annotations: this._annotations,
      title,
      steps: [],
    };
    this._annotations = [];
    return this;
  }

  createBackgroundStep({ text }) {
    this._feature.background.steps.push({
      annotations: this._annotations,
      text,
      docstring: [],
    });
    this._annotations = [];
    return this;
  }

  createBackgroundStepDocString({ text }) {
    this._currentBackgroundStep().docstring.push(text);
    return this;
  }

  createScenario({ title }) {
    const scenario = {
      annotations: this._annotations,
      title,
      steps: [],
    };
    this._annotations = [];
    this._feature.scenarios.push(scenario);
    return this;
  }

  createScenarioStep({ text }) {
    const scenario = this._currentScenario();
    scenario.steps.push({
      annotations: this._annotations,
      text,
      docstring: [],
    });
    this._annotations = [];
    return this;

  }

  createScenarioStepDocString({ text }) {
    this._currentScenarioStep().docstring.push(text);
    return this;
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
      background: feature.background ? this._buildScenario(feature.background) : null,
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
      docstring: step.docstring.length > 0 ? step.docstring.join(os.EOL) : null,
    };
  }
}

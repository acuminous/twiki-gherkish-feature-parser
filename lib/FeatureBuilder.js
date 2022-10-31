import Debug from 'debug';
import os from 'node:os';

const debug = Debug('twiki:gherkish-feature-parser:FeatureBuilder');

export default class FeatureBuilder {

  constructor() {
    this._feature = undefined;
    this._steps = undefined;
    this._annotations = [];
  }

  stashAnnotation(annotation) {
    this._annotations.push(annotation);
  }

  createFeature({ title }) {
    this._feature = {
      annotations: this._annotations.splice(0),
      title,
      scenarios: [],
    };
    return this;
  }

  describeFeature({ text }) {
    this._feature.description = this._feature.description ? `${this._feature.description}\n${text}` : text;
    return this;
  }

  createBackground({ title }) {
    const background = {
      annotations: this._annotations.splice(0),
      title,
      steps: [],
    };
    this._steps = background.steps;
    this._feature.background = background;
    return this;
  }

  createStep({ text }) {
    this._steps.push({
      annotations: this._annotations.splice(0),
      text,
      docstring: [],
    });
    return this;
  }

  createDocstring({ text }) {
    this._currentStep().docstring.push(text);
  }

  createBackgroundStep({ text }) {
    this._steps.push({
      annotations: this._annotations.splice(0),
      text,
      docstring: [],
    });
    return this;
  }

  createBackgroundStepDocString({ text }) {
    this._currentBackgroundStep().docstring.push(text);
    return this;
  }

  createScenario({ title }) {
    const scenario = {
      annotations: this._annotations.splice(0),
      title,
      steps: [],
    };
    this._steps = scenario.steps;
    this._feature.scenarios.push(scenario);
    return this;
  }

  createScenarioStep({ text }) {
    const scenario = this._currentScenario();
    scenario.steps.push({
      annotations: this._annotations.splice(0),
      text,
      docstring: [],
    });
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

  _currentStep() {
    return this._steps[this._steps.length - 1];
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

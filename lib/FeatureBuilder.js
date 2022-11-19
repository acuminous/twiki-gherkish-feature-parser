import Debug from 'debug';
import os from 'node:os';

const debug = Debug('twiki:gherkish-feature-parser:FeatureBuilder');

export default class FeatureBuilder {

  constructor() {
    this._feature = undefined;
    this._scenarioGroup = undefined;
    this._steps = undefined;
    this._annotations = [];
  }

  stashAnnotation(annotation) {
    this._annotations.push(annotation);
  }

  createFeature({ title }) {
    this._feature = { annotations: this._annotations.splice(0), title, rules: [], scenarios: [] };
    this._scenarioGroup = this._feature;
    return this;
  }

  createRule({ title }) {
    const rule = { annotations: this._annotations.splice(0), title, scenarios: [] };
    this._feature.rules.push(rule);
    this._scenarioGroup = rule;
    return this;
  }

  createDescription({ text }) {
    this._scenarioGroup.description = this._scenarioGroup.description ? `${this._scenarioGroup.description}\n${text}` : text;
    return this;
  }

  createBackground({ title }) {
    const background = { annotations: this._annotations.splice(0), title, steps: [] };
    this._steps = background.steps;
    this._scenarioGroup.background = background;
    return this;
  }

  createScenario({ title }) {
    const scenario = { annotations: this._annotations.splice(0), title, steps: [] };
    this._steps = scenario.steps;
    this._scenarioGroup.scenarios.push(scenario);
    return this;
  }

  createStep({ text }) {
    this._steps.push({ annotations: this._annotations.splice(0), text, docstring: [] });
    return this;
  }

  createDocstring({ text }) {
    this._currentStep().docstring.push(text);
    return this;
  }

  _currentStep() {
    return this._steps[this._steps.length - 1];
  }

  build() {
    return this._buildFeature(this._feature);
  }

  _buildFeature(feature) {
    return {
      annotations: feature.annotations.map((annotation) => this._buildAnnotation(annotation)),
      title: feature.title,
      description: feature.description || null,
      background: feature.background ? this._buildScenario(feature.background) : null,
      rules: feature.rules.map((rule) => this._buildRule(rule)),
      scenarios: feature.scenarios.map((scenario) => this._buildScenario(scenario)),
    };
  }

  _buildAnnotation(annotation) {
    return { ...annotation };
  }

  _buildRule(rule) {
    return {
      annotations: rule.annotations.map((annotation) => this._buildAnnotation(annotation)),
      title: rule.title,
      description: rule.description || null,
      background: rule.background ? this._buildScenario(rule.background) : null,
      scenarios: rule.scenarios.map((scenario) => this._buildScenario(scenario)),
    };
  }

  _buildScenario(scenario) {
    return {
      annotations: scenario.annotations.map((annotation) => this._buildAnnotation(annotation)),
      title: scenario.title,
      description: scenario.description || null,
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

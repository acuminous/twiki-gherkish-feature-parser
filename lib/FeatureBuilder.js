import os from 'node:os';

export default class FeatureBuilder {

  #feature;
  #scenario;
  #scenarioGroup;
  #steps;
  #step;
  #annotations = [];

  get stashedAnnotations() {
    return this.#annotations;
  }

  stashAnnotation(annotation) {
    this.#annotations.push(annotation);
  }

  createFeature({ title }) {
    this.#feature = { annotations: this.#annotations.splice(0), title, rules: [], scenarios: [] };
    this.#scenarioGroup = this.#feature;
    return this;
  }

  createRule({ title }) {
    const rule = { annotations: this.#annotations.splice(0), title, scenarios: [] };
    this.#feature.rules.push(rule);
    this.#scenarioGroup = rule;
    return this;
  }

  createDescription({ text }) {
    this.#scenarioGroup.description = this.#scenarioGroup.description ? `${this.#scenarioGroup.description}\n${text}` : text;
    return this;
  }

  createBackground({ title }) {
    const background = { annotations: this.#annotations.splice(0), title, steps: [] };
    this.#steps = background.steps;
    this.#scenarioGroup.background = background;
    return this;
  }

  createScenario({ title }) {
    const scenario = { annotations: this.#annotations.splice(0), title, steps: [] };
    this.#scenario = scenario;
    this.#steps = scenario.steps;
    this.#scenarioGroup.scenarios.push(scenario);
    return this;
  }

  createStep({ text }) {
    const step = { annotations: this.#annotations.splice(0), text, docstring: [] };
    this.#steps.push(step);
    this.#step = step;
    return this;
  }

  createDocstring({ text }) {
    this.#step.docstring.push(text);
    return this;
  }

  createExampleTable({ headings }) {
    this.#scenario.examples = { headings, rows: [] };
    return this;
  }

  createExample({ examples }) {
    const row = examples.reduce((acc, value, index) => {
      const heading = this.#scenario.examples.headings[index];
      return { ...acc, [heading]: value };
    }, {});
    this.#scenario.examples.rows.push(row);
    return this;
  }

  build() {
    return this.#buildFeature(this.#feature);
  }

  #buildFeature(feature) {
    return {
      annotations: feature.annotations.map((annotation) => this.#buildAnnotation(annotation)),
      title: feature.title,
      description: feature.description || null,
      background: feature.background ? this.#buildBackground(feature.background) : null,
      rules: feature.rules.map((rule) => this.#buildRule(rule)),
      scenarios: feature.scenarios.map((scenario) => this.#buildScenario(scenario)),
    };
  }

  #buildAnnotation(annotation) {
    return { ...annotation };
  }

  #buildRule(rule) {
    return {
      annotations: rule.annotations.map((annotation) => this.#buildAnnotation(annotation)),
      title: rule.title,
      description: rule.description || null,
      background: rule.background ? this.#buildBackground(rule.background) : null,
      scenarios: rule.scenarios.map((scenario) => this.#buildScenario(scenario)),
    };
  }

  #buildBackground(background) {
    return {
      annotations: background.annotations.map((annotation) => this.#buildAnnotation(annotation)),
      title: background.title,
      description: background.description || null,
      steps: background.steps.map((step) => this.#buildStep(step)),
    };
  }

  #buildScenario(scenario) {
    return {
      annotations: scenario.annotations.map((annotation) => this.#buildAnnotation(annotation)),
      title: scenario.title,
      description: scenario.description || null,
      steps: scenario.steps.map((step) => this.#buildStep(step)),
      examples: scenario.examples || null,
    };
  }

  #buildStep(step) {
    return {
      annotations: step.annotations.map((annotation) => this.#buildAnnotation(annotation)),
      text: step.text,
      docstring: step.docstring.length > 0 ? step.docstring.join(os.EOL) : null,
    };
  }
}

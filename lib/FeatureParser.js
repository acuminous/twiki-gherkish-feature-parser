import FeatureBuilder from './FeatureBuilder.js';
import Languages from './languages/index.js';
import Session from './Session.js';
import Source from './Source.js';
import StateMachine from './StateMachine.js';

export default class FeatureParser {

  #language;

  constructor(options = {}) {
    this.#language = options.language || Languages.English;
  }

  parse(document, metadata) {
    const featureBuilder = new FeatureBuilder();
    const session = new Session({ language: this.#language });
    const machine = new StateMachine({ featureBuilder, session });
    this.#parseLines(document, metadata, machine);
    return featureBuilder.build();
  }

  #parseLines(document, metadata, machine) {
    document.split(/\n|\r\n/)
      .concat('\u0000')
      .forEach((line, index, lines) => {
        const lineNumber = Math.min(index + 1, lines.length - 1);
        const source = new Source({ line, lineNumber, uri: metadata?.source?.uri });
        machine.interpret(source);
      });
  }
}

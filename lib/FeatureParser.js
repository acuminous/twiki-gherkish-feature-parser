import Debug from 'debug';
import FeatureBuilder from './FeatureBuilder.js';
import Languages from './languages/index.js';
import Session from './Session.js';
import StateMachine from './StateMachine.js';
import { getIndentation } from './utils.js';

const debug = Debug('twiki:gherkish-feature-parser:FeatureParser');
const lineBreak = /\n|\r\n/;
const nullChar = '\u0000';

export default class FeatureParser {

  #language;

  constructor(options = {}) {
    this.#language = options.language || Languages.English;
  }

  parse(document, metadata) {
    const featureBuilder = new FeatureBuilder();
    const session = new Session({ language: this.#language, metadata });
    const machine = new StateMachine({ featureBuilder, session });
    this.#parseLines(document, machine);
    return featureBuilder.build();
  }

  #parseLines(document, machine) {
    document.split(lineBreak)
      .concat(nullChar)
      .forEach((line, index, lines) => {
        const number = Math.min(index + 1, lines.length - 1);
        const indentation = getIndentation(line);
        this.#parseLine({ line, number, indentation }, machine);
      });
  }

  #parseLine(source, machine) {
    debug(`Parsing line ${source.number}: "${source.line}"`);
    machine.interpret(source);
  }
}

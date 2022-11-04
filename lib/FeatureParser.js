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

  constructor(props = {}) {
    this._language = props.language || Languages.English;
  }

  parse(document, metadata) {
    const featureBuilder = new FeatureBuilder();
    const session = new Session({ language: this._language, metadata });
    const machine = new StateMachine({ featureBuilder, session });
    this._parseLines(document, machine);
    return featureBuilder.build();
  }

  _parseLines(document, machine) {
    document.split(lineBreak)
      .concat(nullChar)
      .forEach((line, index, lines) => {
        const number = Math.min(index + 1, lines.length - 1);
        const indentation = getIndentation(line);
        this._parseLine({ line, number, indentation }, machine);
      });
  }

  _parseLine(source, machine) {
    debug(`Parsing line ${source.number}: "${source.line}"`);
    machine.interpret(source);
  }
}

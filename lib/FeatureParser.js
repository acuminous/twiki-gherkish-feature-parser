import Debug from 'debug';
import Languages from './languages/index.js';
import StateMachine from './StateMachine.js';
import { getIndentation } from './utils.js';

const debug = Debug('twiki:gherkish-feature-parser:FeatureParser');
const lineBreak = /\n|\r\n/;
const nullChar = '\u0000';

export default class FeatureParser {

  constructor(props = {}) {
    const { language = Languages.English } = props;
    this._language = language;
  }

  parse(text, metadata) {
    const session = { language: this._language, metadata };
    const machine = new StateMachine({ session });
    this._parseLines(text, machine);
    return machine.build();
  }

  _parseLines(text, machine) {
    text.split(lineBreak)
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

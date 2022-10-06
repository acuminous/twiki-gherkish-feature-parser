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
    const session = { machine: new StateMachine(), language: this._language, metadata };
    this._parseLines(text, session);
    return session.machine.build();
  }

  _parseLines(text, session) {
    text.split(lineBreak)
      .concat(nullChar)
      .forEach((line, index) => {
        const number = index + 1;
        const indentation = getIndentation(line);
        this._parseLine({ line, number, indentation }, session);
      });
  }

  _parseLine(source, session) {
    debug(`Parsing line ${source.number}: "${source.line}"`);
    session.machine.handle(source, session);
  }
}

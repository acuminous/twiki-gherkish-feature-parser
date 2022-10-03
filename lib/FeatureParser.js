import Debug from 'debug';
import Languages from './languages/index.js';
import StateMachine from './StateMachine.js';

const lineBreak = /\n|\r\n/;
const nullChar = '\u0000';
const nonSpace = /[^\s]/;

export default class FeatureParser {
  constructor(props = {}) {
    const { language = Languages.None, debug = Debug('yadda:gherkish:FeatureParser') } = props;
    this._language = language;
    this._debug = debug;
  }

  parse(text, session = {}) {
    session.machine = session.machine || new StateMachine();
    session.language = session.language || this._language;
    this._parseLines(text, session);
    return session.machine.featureBuilder.build();
  }

  static getIndentation(line) {
    return nonSpace.test(line) ? line.search(nonSpace) : line.length;
  }

  _parseLines(text, session) {
    text
      .split(lineBreak)
      .concat(nullChar)
      .forEach((line, index) => {
        const number = index + 1;
        const indentation = FeatureParser.getIndentation(line);
        this._parseLine({ line, number, indentation }, session);
      });
  }

  _parseLine(source, session) {
    this._debug(`Parsing line ${source.number}: "${source.line}"`);
    session.machine.handle(source, session);
  }
}

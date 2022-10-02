import Debug from 'debug';
import Languages from './languages/index.js';
import StateMachine from './StateMachine.js';

const lineBreak = /\n|\r\n/;
const nullChar = '\u0000';
const nonSpace = /[^\s]/;

export default class SpecificationParser {
  constructor(props = {}) {
    const { debug = Debug('yadda:gherkish:SpecificationParser') } = props;

    this._debug = debug;
  }

  parse(text, session = {}) {
    session.machine = session.machine || new StateMachine();
    session.language = session.language || Languages.utils.getDefault();
    this._parseLines(text, session);
    return session.machine.specification.serialise();
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
        const indentation = SpecificationParser.getIndentation(line);
        this._parseLine({ line, number, indentation }, session);
      });
  }

  _parseLine(source, session) {
    this._debug(`Parsing line ${source.number}: "${source.line}"`);
    session.machine.handle(source, session);
  }
}

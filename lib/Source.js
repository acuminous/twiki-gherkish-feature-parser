const nonSpace = /[\S]/;

export default class Source {

  #line;
  #lineNumber;
  #indentation;
  #uri;

  constructor({ line, lineNumber, uri }) {
    this.#line = line;
    this.#lineNumber = lineNumber;
    this.#indentation = nonSpace.test(line) ? line.search(nonSpace) : line.length;
    this.#uri = uri;
  }

  get line() {
    return this.#line;
  }

  get indentation() {
    return this.#indentation;
  }

  get appellative() {
    return `${this.#uri}:${this.#lineNumber}`;
  }
}

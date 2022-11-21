import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import { Languages } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { Spanish } = Languages;

describe('Spanish', () => {
  it('should map keywords', () => {
    deq(Spanish.translate('feature'), /^\s*(?:funcionalidad|característica)\s*:\s*(.*)/i);
    deq(Spanish.translate('background'), /^\s*(?:fondo)\s*:\s*(.*)/i);
    deq(Spanish.translate('scenario'), /^\s*(?:escenario|caso)\s*:\s*(.*)/i);
    deq(Spanish.translate('examples'), /^\s*(?:ejemplos|ejemplo)\s*:\s*(.*)/i);
  });

  it('should report missing translations', () => {
    throws(() => Spanish.translate('missing'), { message: 'Spanish is missing a translation for the "missing" keyword - Please submit a pull request at https://github.com/acuminous/twiki-gherkish-feature-parser/pulls' });
  });
});

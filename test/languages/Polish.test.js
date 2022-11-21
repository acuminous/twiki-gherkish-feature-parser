import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import { Languages } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { Polish } = Languages;

describe('Polish', () => {
  it('should map keywords', () => {
    deq(Polish.translate('feature'), /^\s*(?:właściwość|funkcja|aspekt|potrzeba biznesowa)\s*:\s*(.*)/i);
    deq(Polish.translate('background'), /^\s*(?:założenia)\s*:\s*(.*)/i);
    deq(Polish.translate('scenario'), /^\s*(?:scenariusz)\s*:\s*(.*)/i);
    deq(Polish.translate('examples'), /^\s*(?:przykłady)\s*:\s*(.*)/i);
  });

  it('should report missing translations', () => {
    throws(() => Polish.translate('missing'), { message: 'Polish is missing a translation for the "missing" keyword - Please submit a pull request at https://github.com/acuminous/twiki-gherkish-feature-parser/pulls' });
  });
});

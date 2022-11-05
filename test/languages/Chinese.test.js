import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq, throws } from 'node:assert';
import { Languages } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { Chinese } = Languages;

describe('Chinese', () => {
  it('should map keywords', () => {
    deq(Chinese.translate('feature'), /^\s*(?:功能)\s*:\s*(.*)/i);
    deq(Chinese.translate('background'), /^\s*(?:背景|前提)\s*:\s*(.*)/i);
    deq(Chinese.translate('scenario'), /^\s*(?:场景)\s*:\s*(.*)/i);
    deq(Chinese.translate('examples'), /^\s*(?:例子|示例|举例|样例)\s*:\s*(.*)/i);
  });

  it('should report missing translations', () => {
    throws(() => Chinese.translate('missing'), { message: 'Chinese is missing a translation for the "missing" keyword. Please submit a pull request to https://github.com/acuminous/twiki-gherkish-feature-parser' });
  });
});

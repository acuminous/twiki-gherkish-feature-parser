import zunit from 'zunit';
import { strictEqual as eq, deepStrictEqual as deq } from 'node:assert';
import { Events, Source } from '../../lib/index.js';

const { describe, it, xdescribe, xit, odescribe, oit, before, beforeEach, after, afterEach } = zunit;
const { SingleLineCommentEvent } = Events;

describe('SingleLineCommentEvent', () => {

  it('should test single line comments', () => {
    const event = new SingleLineCommentEvent();

    eq(event.test(new Source({ line: '# Some comment' })), true);
    eq(event.test(new Source({ line: ' # Some comment' })), true);
    eq(event.test(new Source({ line: '#' })), true);
    eq(event.test(new Source({ line: '## Some comment' })), true);

    eq(event.test(new Source({ line: 'No commment' })), false);
  });

  it('should interpret single line comments', () => {
    const event = new SingleLineCommentEvent();

    eq(event.interpret({ line: '# Some comment' }), undefined);
    eq(event.interpret({ line: ' # Some comment' }), undefined);
    eq(event.interpret({ line: '#' }), undefined);
    eq(event.interpret({ line: '## Some comment' }), undefined);
  });
});

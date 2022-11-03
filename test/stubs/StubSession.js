import Session from '../../lib/Session.js';

const metadata = {
  source: {
    uri: 'index.js',
  },
};

export default class StubSession extends Session {
  constructor(props) {
    super({ metadata, ...props });
  }
}

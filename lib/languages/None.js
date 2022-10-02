import Debug from 'debug';
import BaseLanguage from './BaseLanguage.js';

export default class None extends BaseLanguage {
  constructor() {
    super({
      vocabulary: {
        step: [],
        feature: ['feature'],
        scenario: ['scenario'],
        background: ['background'],
      },
      debug: Debug('yadda:languages:None'),
    });
  }
}

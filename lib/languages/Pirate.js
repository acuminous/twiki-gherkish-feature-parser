import Debug from 'debug';
import BaseLanguage from './BaseLanguage.js';

export default class Pirate extends BaseLanguage {
  constructor() {
    super({
      code: 'bv',
      vocabulary: {
        step: ['giveth', 'whence', 'thence', 'and', 'but', 'except'],
        feature: ['tale', 'yarn'],
        scenario: ['adventure', 'sortie'],
        background: ['lore'],
      },
      debug: Debug('yadda:languages:Pirate'),
    });
  }
}

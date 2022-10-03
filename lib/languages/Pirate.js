import Debug from 'debug';
import BaseLanguage from './BaseLanguage.js';

export default new BaseLanguage({
  name: 'Pirate',
  code: 'bv',
  vocabulary: {
    feature: ['tale', 'yarn'],
    scenario: ['adventure', 'sortie'],
    background: ['lore'],
  },
  debug: Debug('yadda:languages:Pirate'),
});

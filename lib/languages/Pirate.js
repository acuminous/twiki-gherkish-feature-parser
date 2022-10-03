import Debug from 'debug';
import BaseLanguage from './BaseLanguage.js';

export default new BaseLanguage({
  name: 'Pirate',
  code: 'bv',
  keywords: {
    feature: ['tale', 'yarn'],
    background: ['lore'],
    scenario: ['adventure', 'sortie'],
  },
  debug: Debug('twiki-bdd:gherkish-feature-parser:languages:Pirate'),
});

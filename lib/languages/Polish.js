import BaseLanguage from './BaseLanguage.js';

export default new BaseLanguage({
  name: 'Polish',
  code: 'pl',
  keywords: {
    feature: ['właściwość', 'funkcja', 'aspekt', 'potrzeba biznesowa'],
    background: ['założenia'],
    scenario: ['scenariusz'],
    examples: ['przykłady'],
  },
});

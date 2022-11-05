import BaseLanguage from './BaseLanguage.js';

export default new BaseLanguage({
  name: 'Portugeuse',
  code: 'pt',
  keywords: {
    feature: ['funcionalidade', 'característica', 'caracteristica'],
    background: ['fundo'],
    scenario: ['cenário', 'cenario'],
    examples: ['exemplos', 'exemplo'],
  },
});

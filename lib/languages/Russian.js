import BaseLanguage from './BaseLanguage.js';

export default new BaseLanguage({
  name: 'Russian',
  code: 'ru',
  keywords: {
    feature: ['функция', 'функционал', 'свойство'],
    background: ['предыстория', 'контекст'],
    scenario: ['cценарий'],
    examples: ['Примеры'],
  },
});

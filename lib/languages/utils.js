import Debug from 'debug';

import English from './English.js';
import Pirate from './Pirate.js';
import None from './None.js';

const debug = Debug('yadda:Languages:utils');
const languages = [English, Pirate, None];

function getDefault() {
  return instance;
}

function setDefault(identifier) {
  const language = find(identifier);
  if (!language) throw new Error(`Unknown language: ${identifier}`);
  instance = language;
}

function add(language, isDefault = true) {
  if (find(language.name) || find(language.code)) throw new Error(`Language: ${language} already exists`);
  languages.push(language);
  if (isDefault) setDefault(language.name);
}

function find(id) {
  debug(`Finding language by id: ${id}`);
  return languages.find((l) => l.answersToName(id) || l.answersToCode(id));
}

function get(id) {
  return find(id) || reportMissingLanguage(id);
}

function reportMissingLanguage(id) {
  throw Error(`Language: ${id} was not found`);
}

let instance = find('none');

export {
  getDefault,
  setDefault,
  find,
  get,
  add,
};

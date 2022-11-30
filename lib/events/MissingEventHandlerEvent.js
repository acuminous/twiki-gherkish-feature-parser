import BaseEvent from './BaseEvent.js';

export default class MissingEventHandlerEvent extends BaseEvent {

  constructor() {
    super({ expected: false });
  }

  test() {
    return true;
  }
}

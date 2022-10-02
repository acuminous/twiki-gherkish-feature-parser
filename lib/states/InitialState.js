import BaseState from './BaseState.js';
import Languages from '../languages/index.js';
import { AnnotationEvent, BlankLineEvent, EndEvent, FeatureEvent, LanguageEvent, MultiLineCommentEvent, SingleLineCommentEvent } from '../events/index.js';

const events = [EndEvent, LanguageEvent, MultiLineCommentEvent, SingleLineCommentEvent, AnnotationEvent, FeatureEvent, BlankLineEvent];

export default class InitialState extends BaseState {
  constructor({ machine, specification }) {
    super({ machine, events });
    this._specification = specification;
    this._annotations = [];
  }

  onAnnotation(event) {
    this._annotations.push({ ...event.data });
  }

  onFeature(event) {
    this._specification.createFeature({ annotations: this._annotations, ...event.data });
    this._machine.toCreateFeatureState();
  }

  onLanguage(event, session) {
    session.language = Languages.utils.get(event.data.name);
  }

  onMultiLineComment() {
    this._machine.toConsumeMultiLineCommentState();
  }
};

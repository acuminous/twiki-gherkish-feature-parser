import Debug from 'debug';
import BaseState from './BaseState.js';
import * as Events from '../events/index.js';

const debug = Debug('twiki:gherkish-feature-parser:states:StubState');

const events = [
  new Events.AnnotationEvent({ expected: true }),
  new Events.BlankLineEvent({ expected: true }),
  new Events.BlockCommentDelimiterEvent({ expected: true }),
  new Events.EndEvent({ expected: true }),
  new Events.BackgroundEvent({ expected: true }),
  new Events.ExampleTableDataRowEvent({ expected: true }),
  new Events.ExampleTableEvent({ expected: true }),
  new Events.ExampleTableHeaderRowEvent({ expected: true }),
  new Events.ExampleTableSeparatorRowEvent({ expected: true }),
  new Events.ExplicitDocstringStartEvent({ expected: true }),
  new Events.ImplicitDocstringStartEvent({ expected: true }),
  new Events.FeatureEvent({ expected: true }),
  new Events.SingleLineCommentEvent({ expected: true }),
  new Events.RuleEvent({ expected: true }),
  new Events.ScenarioEvent({ expected: true }),
  new Events.StepEvent({ expected: true }),
];

export default class StubState extends BaseState {

  constructor({ machine }) {
    super({ machine, events, debug });
  }

  onAnnotation() {}

  onBackground() {}

  onBlankLine() {}

  onBlockCommentDelimiter() {}

  onEnd() {}

  onExampleTable() {}

  onExampleTableDataRow() {}

  onExampleTableHeaderRow() {}

  onExampleTableSeparatorRow() {}

  onExplicitDocstringStart() {}

  onImplicitDocstringStart() {}

  onFeature() {}

  onRule() {}

  onScenario() {}

  onSingleLineComment() {}

  onStep() {}
}

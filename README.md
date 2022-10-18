# twiki-gherkish-feature-parser

[![Node.js CI](https://github.com/acuminous/twiki-gherkish-feature-parser/workflows/Node.js%20CI/badge.svg)](https://github.com/acuminous/twiki-gherkish-feature-parser/actions?query=workflow%3A%22Node.js+CI%22)
[![Maintainability](https://api.codeclimate.com/v1/badges/6837424f9e1fc6a634bf/maintainability)](https://codeclimate.com/github/acuminous/twiki-gherkish-feature-parser/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/6837424f9e1fc6a634bf/test_coverage)](https://codeclimate.com/github/acuminous/twiki-gherkish-feature-parser/test_coverage)
[![Tested with zUnit](https://img.shields.io/badge/Tested%20with-zUnit-brightgreen)](https://www.npmjs.com/package/zunit)

## TL;DR

```js
import { FeatureParser } from "@twiki-bdd/gherkish-feature-parser";
import * as fs from "node:fs";

const featureFilePath = "./buck-rogers-season-one.feature";
const featureFile = fs.readFileSync(featureFilePath);
const parser = new FeatureParser();
const metadata = {
  source: {
    uri: featureFilePath,
  },
};
const feature = parser.parse(featureFile, metadata);
```

## Parser Options

| Option   | Notes                                |
| -------- | ------------------------------------ |
| language | A language from the Languages module |

```js
import { FeatureParser, Languages } from "@twiki-bdd/gherkish-feature-parser";
import * as fs from "node:fs";

const featureFilePath = "./buck-rogers-season-one.feature";
const featureFile = fs.readFileSync(featureFilePath);
const parser = new FeatureParser({ language: Languages.English });
const metadata = {
  source: {
    uri: featureFilePath,
  },
};
const feature = parser.parse(file, metadata);
```

## Gherkin Compatability

| Syntax                       | Supported                                      |
| ---------------------------- | ---------------------------------------------- |
| Language                     | No - use the parser 'language' option instead  |
| Feature                      | Yes                                            |
| Feature descriptions         | Yes                                            |
| Feature tags/annotations     | Yes                                            |
| Feature backgrounds          | Yes                                            |
| Background tags/annotations  | Yes                                            |
| Rules                        | Not yet - watch this space                     |
| Scenario Outlines            | Not yet - watch this space                     |
| Scenarios                    | Yes                                            |
| Scenario descriptions        | Yes                                            |
| Scenario tags/annotations    | Yes                                            |
| Steps                        | Yes                                            |
| Step tags/annotations        | Yes                                            |
| Given / When / Then keywords | No - twiki does not special case step keywords |
| Docstring                    | Yes, use """ or ---                            |

## State Machine

The parser uses a state machine which transitions between states in response to certain events. The event are determined by asking the current state whether it can handle a line of text from the feature specification. The state maintains a list of potential events, which it asks to handle the line of text. The first event that supports the line of text, will parse the text and dispatch the event data to the current state. If no event accepts the line of text, then a MissingEventHandler event is dispatched instead.

When handling an event, the state may do one or more of the following

- Use the event data to construct an internal representation of the feature
- Ask the state machine to transition to a new state
- Ask the state machine to unwind to a previous state
- Dispatch the event to the new state after tranistioning or unwinding
- Ask the state machine to rehandle the original line of text after transitioning or unwinding

For example, the state machine starts off in the [Initial State](#InitialState). If the first line of text in the feature specifciation is `@skip` then this will be intercepted by the [Initial State's](#InitialState) AnnotationEvent. The AnnotationEvent will parse the text, resulting in the following event data `{ name: "skip", value: true }`. The event data will be dispatched to the [Initial State's](#InitialState) `onAnnotation` event handler, which will ask the state machine to move to the [Annotation State](#AnnotationState) before invoking the Annotation State's `onAnnotation` event handler with the same event data. The [Annotation State's](#AnnotationState) `onAnnotation` event handler will ask the FeatureBuilder to stash the annotation data, until such time as a feature is created.

### Events

| Name                        | Data        | Examples                                                                                        |
| --------------------------- | ----------- | ----------------------------------------------------------------------------------------------- |
| AnnotationEvent             | name, value | @skip<br/>@timeout=1000                                                                         |
| BackgroundEvent             | title?      | Background:<br/>Background: Introduction                                                        |
| BlankLineEvent              |             |                                                                                                 |
| BlockCommentDelimiterEvent  |             | ###                                                                                             |
| DocStringTextEvent          | text        | This is a line in a docstring                                                                   |
| EndEvent                    |             | \u0000 _(automatically appended by the feature parser)_                                         |
| ExampleTableEvent           |             | Where:                                                                                          |
| ExampleTableHeaderRow       | headings    | \| height \| width \|                                                                           |
| ExampleTableSeparatorRow    |             | \|--------\|---------\|                                                                         |
| ExampleTableDataRow         | values      | \|&nbsp;&nbsp;10cm&nbsp;&nbsp;\|&nbsp;&nbsp;20cm&nbsp;&nbsp;\|                                  |
| ExplicitDocStringStartEvent |             | ---</br>"""</br>                                                                                |
| ExplicitDocStringStopEvent  |             | ---</br>"""</br>                                                                                |
| FeatureEvent                | title?      | Feature:<br/>Feature: Buck Rogers - Season One                                                  |
| ImplicitDocStringStartEvent | text        | &nbsp;&nbsp;&nbsp;This&nbsp;is&nbsp;the&nbsp;start&nbsp;of&nbsp;an&nbsp;indented&nbsp;docstring |
| ImplicitDocStringStopEvent  | text        | This&nbsp;is&nbsp;the&nbsp;start&nbsp;of&nbsp;an&nbsp;indented&nbsp;docstring                   |
| ScenarioEvent               | title?      | Scenario:<br/>Scenario: Awakening                                                               |
| SingleLineCommentEvent      |             | # This is a comment                                                                             |
| StepEvent                   | text        | This is a step                                                                                  |
| TextEvent                   | text        | This is some text                                                                               |

### States

#### InitialState

| Event                      | Action                | Destination                             |
| -------------------------- | --------------------- | --------------------------------------- |
| AnnotationEvent            | Transition & Dispatch | [AnnotationState](#AnnotationState)     |
| BlankLineEvent             |                       |                                         |
| BlockCommentDelimiterEvent | Transition            | [BlockCommentState](#BlockCommentState) |
| FeatureEvent               | Transition            | [FeatureState](#FeatureState)           |
| SingleLineComment          |                       |                                         |

#### AnnotationState

| Event                      | Action            | Destination                                           |
| -------------------------- | ----------------- | ----------------------------------------------------- |
| AnnotationEvent            |                   |                                                       |
| BlankLineEvent             |                   |                                                       |
| BackgroundEvent            | Unwind & Dispatch | [BackgroundStateB](#BackgroundStateB)                 |
| BlockCommentDelimiterEvent | Transition        | [BlockCommentState](#BlockCommentState)               |
| ExampleTableDataRowEvent   | Unwind & Dispatch | [ExampleTableDateRowState](#ExampleTableDateRowState) |
| FeatureEvent               | Unwind & Dispatch | [FeatureState](#FeatureState)                         |
| ScenarioEvent              | Unwind & Dispatch | [ScenarioStateA](#ScenarioStateA)                     |
| SingleLineComment          |                   |                                                       |
| StepEvent                  | Unwind & Dispatch | [StepsState](#StepsState)                             |

#### FeatureStateA

| Event                      | Action                | Destination                             |
| -------------------------- | --------------------- | --------------------------------------- |
| AnnotationEvent            | Transition & Dispatch | [AnnotationState](#AnnotationState)     |
| BackgroundEvent            | Transition            | [BackgroundStateA](#BackgroundStateA)   |
| BlankLineEvent             |                       |                                         |
| BlockCommentDelimiterEvent | Transition            | [BlockCommentState](#BlockCommentState) |
| ScenarioEvent              | Transition & Dispatch | [FeatureStateB](#FeatureStateB)         |
| SingleLineComment          |                       |                                         |
| TextEvent                  |                       |                                         |

#### FeatureStateB

| Event                      | Action                | Destination                             |
| -------------------------- | --------------------- | --------------------------------------- |
| AnnotationEvent            | Transition & Dispatch | [AnnotationState](#AnnotationState)     |
| BlankLineEvent             |                       |                                         |
| BlockCommentDelimiterEvent | Transition            | [BlockCommentState](#BlockCommentState) |
| ScenarioEvent              | Transition            | [ScenarioStateA](#ScenarioStateA)       |
| SingleLineComment          |                       |                                         |

#### BackgroundStateA

| Event                      | Action                | Destination                             |
| -------------------------- | --------------------- | --------------------------------------- |
| AnnotationEvent            | Transition & Dispatch | [AnnotationState](#AnnotationState)     |
| BlankLineEvent             |                       |                                         |
| BlockCommentDelimiterEvent | Transition            | [BlockCommentState](#BlockCommentState) |
| SingleLineComment          |                       |                                         |
| StepEvent                  | Transition & Dispatch | [BackgroundStateB](#BackgroundStateB)   |

#### BackgroundStateB

| Event                      | Action                | Destination                             |
| -------------------------- | --------------------- | --------------------------------------- |
| AnnotationEvent            | Transition & Dispatch | [AnnotationState](#AnnotationState)     |
| BlankLineEvent             |                       |                                         |
| BlockCommentDelimiterEvent | Transition            | [BlockCommentState](#BlockCommentState) |
| ScenarioEvent              | Unwind & Dispatch     | [FeatureStateB](#FeatureStateB)         |
| SingleLineComment          |                       |                                         |
| StepEvent                  | Transition & Dispatch | [StepsState](#StepsState)               |

#### ScenarioStateA

| Event                      | Action                | Destination                             |
| -------------------------- | --------------------- | --------------------------------------- |
| AnnotationEvent            | Transition & Dispatch | [AnnotationState](#AnnotationState)     |
| BlankLineEvent             |                       |                                         |
| BlockCommentDelimiterEvent | Transition            | [BlockCommentState](#BlockCommentState) |
| SingleLineComment          |                       |                                         |
| StepEvent                  | Transition & Dispatch | [ScenarioStateB](#ScenarioStateB)       |

#### ScenarioStateB

| Event                      | Action                | Destination                             |
| -------------------------- | --------------------- | --------------------------------------- |
| AnnotationEvent            | Transition & Dispatch | [AnnotationState](#AnnotationState)     |
| BlankLineEvent             |                       |                                         |
| BlockCommentDelimiterEvent | Transition            | [BlockCommentState](#BlockCommentState) |
| EndEvent                   | Transition            | [FinalState](#FinalState)               |
| ExampleTableEvent          | Transition            | [ExampleTableState](#ExampleTableState) |
| ScenarioEvent              | Unwind & Dispatch     | [FeatureStateB](#FeatureStateB)         |
| SingleLineComment          |                       |                                         |
| StepEvent                  | Transition & Dispatch | [StepsState](#StepsState)               |

#### StepsState

| Event                       | Action                | Destination                                         |
| --------------------------- | --------------------- | --------------------------------------------------- |
| AnnotationEvent             | Transition & Dispatch | [AnnotationState](#AnnotationState)                 |
| BlankLineEvent              |                       |
| BlockCommentDelimiterEvent  | Transition & Dispatch | [BlockCommentState](#BlockCommentState)             |
| EndEvent                    | Unwind & Dispatch     | [ScenarioStateB](#ScenarioStateB)                   |
| ExampleTableEvent           | Unwind & Dispatch     | [ScenarioStateB](#ScenarioStateB)                   |
| ExplicitDocStringStartEvent | Transition            | [ExplicitDocStringStateA](#ExplicitDocStringStateA) |
| ImplicitDocStringStartEvent | Transition            | [ImplicitDocStringState](#ImplicitDocStringState)   |
| ScenarioEvent               | Unwind & Dispatch     | [FeatureStateB](#FeatureStateB)                     |
| SingleLineComment           |                       |                                                     |
| StepEvent                   |                       |                                                     |

#### ExplicitDocStringStateA

| Event              | Action     | Destination                                         |
| ------------------ | ---------- | --------------------------------------------------- |
| DocStringTextEvent | Transition | [ExplicitDocStringStateB](#ExplicitDocStringStateB) |

#### ExplicitDocStringStateB

| Event                      | Action | Destination                                                                |
| -------------------------- | ------ | -------------------------------------------------------------------------- |
| DocStringTextEvent         |        |                                                                            |
| ExplicitDocStringStopEvent | Unwind | [ScenarioStateB](#ScenarioStateB) or [BackgroundStateB](#BackgroundStateB) |

#### ImplicitDocStringState

| Event                      | Action          | Destination                                                                |
| -------------------------- | --------------- | -------------------------------------------------------------------------- |
| DocStringTextEvent         |                 |                                                                            |
| ImplicitDocStringStopEvent | Unwind & Handle | [ScenarioStateB](#ScenarioStateB) or [BackgroundStateB](#BackgroundStateB) |

#### ExampleTableState

| Event                      | Action     | Destination                                         |
| -------------------------- | ---------- | --------------------------------------------------- |
| BlankLineEvent             |            |                                                     |
| BlockCommentDelimiterEvent | Transition | [BlockCommentState](#BlockCommentState)             |
| ExampleTableHeaderRowEvent | Transition | [ExampleTableHeaderState](#ExampleTableHeaderState) |
| SingleLineComment          |            |                                                     |

#### ExampleTableHeaderState

| Event                         | Action     | Destination                                               |
| ----------------------------- | ---------- | --------------------------------------------------------- |
| ExampleTableSeparaterRowEvent | Transition | [ExampleTableSeparatorState](#ExampleTableSeparatorState) |

#### ExampleTableSeparatorState

| Event                    | Action                | Destination                                           |
| ------------------------ | --------------------- | ----------------------------------------------------- |
| AnnotationEvent          | Transition & Dispatch | [AnnotationState](#AnnotationState)                   |
| ExampleTableDataRowEvent | Transition            | [ExampleTableDataRowState](#ExampleTableDataRowState) |

#### ExampleTableDataRowState

| Event                    | Action                | Destination                         |
| ------------------------ | --------------------- | ----------------------------------- |
| AnnotationEvent          | Transition & Dispatch | [AnnotationState](#AnnotationState) |
| EndEvent                 | Unwind & Dispatch     | [ScenarioStateB](#ScenarioStateB)   |
| ExampleTableDataRowEvent |                       |                                     |
| ScenarioEvent            | Unwind & Dispatch     | [ScenarioStateB](#ScenarioStateB)   |
| SingleLineComment        |                       |                                     |

#### BlockCommentState

| Event                      | Action     | Destination                             |
| -------------------------- | ---------- | --------------------------------------- |
| BlockCommentDelimiterEvent | Transition | [BlockCommentState](#BlockCommentState) |
| TextEvent                  |            |                                         |

#### FinalState

No more possible events or actions

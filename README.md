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

The parser uses a state machine which transitions between states in response to certain events. The event are determined by asking the current state whether it can handle a line of text from the feature specification. The state maintains a list of potential events, which it asks to handle the line of text. The first event that supports the line of text will parse the text and dispatch the event data to the current state. If no event accepts the line of text, then a MissingEventHandler event is dispatched instead.

When handling an event, the state may do one or more of the following

- Use the event data to **build** an internal representation of the feature
- Ask the state machine to **transition** to a new state
- Ask the state machine to **unwind** to the previous state that supports the event
- **Dispatch** the event to the new state after transitioning or unwinding
- Ask the state machine to **handle** the original line of text after transitioning or unwinding
- **Absorb** the event
- Report an unexpected event
- Report a missing event handler

For example, the state machine starts off in the [Initial State](#InitialState). If the first line of text in the feature specifciation is `@skip` then this will be intercepted by the [InitialState's](#InitialState) AnnotationEvent. The AnnotationEvent will parse the text, resulting in the following event data: `{ name: "skip", value: true }`. The event data will be dispatched to the [InitialState's](#InitialState) annotation event handler, which will ask the state machine to move to the [#ConsumeAnnotationsState](#ConsumeAnnotationsState) before redispatching the event data to the [#ConsumeAnnotationsState's](#ConsumeAnnotationsState) annotation event handler. The [#ConsumeAnnotationsState's](#ConsumeAnnotationsState) annotation event handler will ask the FeatureBuilder to stash the annotation data until such time as a feature is created.

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

| Event                      | Action                | Destination                                           |
| -------------------------- | --------------------- | ----------------------------------------------------- |
| AnnotationEvent            | Transition & Dispatch | [ConsumeAnnotationsState](#ConsumeAnnotationsState)   |
| BlankLineEvent             | Absorb                |                                                       |
| BlockCommentDelimiterEvent | Transition            | [ConsumeBlockCommentState](#ConsumeBlockCommentState) |
| FeatureEvent               | Build & Transition    | [BeginFeatureState](#BeginFeatureState)               |
| SingleLineComment          | Absorb                |                                                       |

#### ConsumeAnnotationsState

| Event                      | Action            | Destination                                                                                                                                                                                                                                                           |
| -------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AnnotationEvent            | Build             |                                                                                                                                                                                                                                                                       |
| BlankLineEvent             | Absorb            |                                                                                                                                                                                                                                                                       |
| BackgroundEvent            | Unwind & Dispatch | Previous supporting state ([BeginFeatureState](#BeginFeatureState))                                                                                                                                                                                                   |
| BlockCommentDelimiterEvent | Transition        | [ConsumeBlockCommentState](#ConsumeBlockCommentState)                                                                                                                                                                                                                 |
| ExampleTableDataRowEvent   | Unwind & Dispatch | Previous supporting state ([ExampleTableDataRowConsumeState](#ExampleTableDataRowConsumeState))                                                                                                                                                                       |
| FeatureEvent               | Unwind & Dispatch | Previous supporting state ([InitialState](#InitialState))                                                                                                                                                                                                             |
| ScenarioEvent              | Unwind & Dispatch | Previous supporting state ([BeginFeatureState](#BeginFeatureState), [BeginScenariosState](#BeginScenariosState), [ContinueBackgroundState](#ContinueBackgroundState) or [ContinueScenarioState](#ContinueScenarioState))                                              |
| SingleLineComment          | Absorb            |                                                                                                                                                                                                                                                                       |
| StepEvent                  | Unwind & Dispatch | Previous supporting state ([BeginBackgroundState](#BeginBackgroundState), [ContinueBackgroundState](#ContinueBackgroundState), [BeginScenarioState](#BeginScenarioState), [ContinueScenarioState](#ContinueScenarioState) or [ConsumeStepsState](#ConsumeStepsState)) |

#### BeginFeatureState

| Event                      | Action                | Destination                                           |
| -------------------------- | --------------------- | ----------------------------------------------------- |
| AnnotationEvent            | Transition & Dispatch | [ConsumeAnnotationsState](#ConsumeAnnotationsState)   |
| BackgroundEvent            | Build & Transition    | [BeginBackgroundState](#BeginBackgroundState)         |
| BlankLineEvent             | Absorb                |                                                       |
| BlockCommentDelimiterEvent | Transition            | [ConsumeBlockCommentState](#ConsumeBlockCommentState) |
| ScenarioEvent              | Transition & Dispatch | [BeginScenariosState](#BeginScenariosState)           |
| SingleLineComment          | Absorb                |                                                       |
| TextEvent                  | Build                 |                                                       |

#### BeginBackgroundState

| Event                      | Action                | Destination                                           |
| -------------------------- | --------------------- | ----------------------------------------------------- |
| AnnotationEvent            | Transition & Dispatch | [ConsumeAnnotationsState](#ConsumeAnnotationsState)   |
| BlankLineEvent             | Absorb                |                                                       |
| BlockCommentDelimiterEvent | Transition            | [ConsumeBlockCommentState](#ConsumeBlockCommentState) |
| SingleLineComment          | Absorb                |                                                       |
| StepEvent                  | Transition & Dispatch | [ContinueBackgroundState](#ContinueBackgroundState)   |

#### ContinueBackgroundState

| Event                      | Action                | Destination                                                             |
| -------------------------- | --------------------- | ----------------------------------------------------------------------- |
| AnnotationEvent            | Transition & Dispatch | [ConsumeAnnotationsState](#ConsumeAnnotationsState)                     |
| BlankLineEvent             | Absorb                |                                                                         |
| BlockCommentDelimiterEvent | Transition            | [ConsumeBlockCommentState](#ConsumeBlockCommentState)                   |
| ScenarioEvent              | Unwind & Dispatch     | Previous supporting state ([BeginScenariosState](#BeginScenariosState)) |
| SingleLineComment          | Absorb                |                                                                         |
| StepEvent                  | Transition & Dispatch | [ConsumeStepsState](#ConsumeStepsState)                                 |

#### BeginScenariosState

| Event                      | Action                | Destination                                           |
| -------------------------- | --------------------- | ----------------------------------------------------- |
| AnnotationEvent            | Transition & Dispatch | [ConsumeAnnotationsState](#ConsumeAnnotationsState)   |
| BlankLineEvent             | Absorb                |                                                       |
| BlockCommentDelimiterEvent | Transition            | [ConsumeBlockCommentState](#ConsumeBlockCommentState) |
| ScenarioEvent              | Build & Transition    | [BeginScenarioState](#BeginScenarioState)             |
| SingleLineComment          | Absorb                |                                                       |

#### BeginScenarioState

| Event                      | Action                | Destination                                           |
| -------------------------- | --------------------- | ----------------------------------------------------- |
| AnnotationEvent            | Transition & Dispatch | [ConsumeAnnotationsState](#ConsumeAnnotationsState)   |
| BlankLineEvent             | Absorb                |                                                       |
| BlockCommentDelimiterEvent | Transition            | [ConsumeBlockCommentState](#ConsumeBlockCommentState) |
| SingleLineComment          | Absorb                |                                                       |
| StepEvent                  | Transition & Dispatch | [ContinueScenarioState](#ContinueScenarioState)       |

#### ContinueScenarioState

| Event                      | Action                | Destination                                                             |
| -------------------------- | --------------------- | ----------------------------------------------------------------------- |
| AnnotationEvent            | Transition & Dispatch | [ConsumeAnnotationsState](#ConsumeAnnotationsState)                     |
| BlankLineEvent             | Absorb                |                                                                         |
| BlockCommentDelimiterEvent | Transition            | [ConsumeBlockCommentState](#ConsumeBlockCommentState)                   |
| EndEvent                   | Transition            | [EndFeatureState](#EndFeatureState)                                     |
| ExampleTableEvent          | Transition            | [BeginExampleTableState](#BeginExampleTableState)                       |
| ScenarioEvent              | Unwind & Dispatch     | Previous supporting state ([BeginScenariosState](#BeginScenariosState)) |
| SingleLineComment          | Absorb                |                                                                         |
| StepEvent                  | Transition & Dispatch | [ConsumeStepsState](#ConsumeStepsState)                                 |

#### ConsumeStepsState

| Event                       | Action                | Destination                                                                                                                        |
| --------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| AnnotationEvent             | Transition & Dispatch | [ConsumeAnnotationsState](#ConsumeAnnotationsState)                                                                                |
| BlankLineEvent              | Absorb                |                                                                                                                                    |
| BlockCommentDelimiterEvent  | Transition            | [ConsumeBlockCommentState](#ConsumeBlockCommentState)                                                                              |
| EndEvent                    | Unwind & Dispatch     | Previous supporting state ([ContinueScenarioState](#ContinueScenarioState))                                                        |
| ExampleTableEvent           | Unwind & Dispatch     | Previous supporting state ([ContinueScenarioState](#ContinueScenarioState))                                                        |
| ExplicitDocStringStartEvent | Transition            | [BeginExplicitDocStringState](#BeginExplicitDocStringState)                                                                        |
| ImplicitDocStringStartEvent | Transition & Dispatch | [BeginImplicitDocStringState](#BeginImplicitDocStringState)                                                                        |
| ScenarioEvent               | Unwind & Dispatch     | Previous supporting state ([ContinueBackgroundState](#ContinueBackgroundState) or [ContinueScenarioState](#ContinueScenarioState)) |
| SingleLineComment           | Absorb                |                                                                                                                                    |
| StepEvent                   | Build                 |                                                                                                                                    |

#### BeginExplicitDocStringState

| Event              | Action                | Destination                                                     |
| ------------------ | --------------------- | --------------------------------------------------------------- |
| DocStringTextEvent | Transition & Dispatch | [ConsumeExplicitDocStringState](#ConsumeExplicitDocStringState) |

#### ConsumeExplicitDocStringState

| Event                      | Action     | Destination                             |
| -------------------------- | ---------- | --------------------------------------- |
| DocStringTextEvent         | Build      |                                         |
| ExplicitDocStringStopEvent | Transition | [EndDocStringState](#EndDocStringState) |

#### BeginImplicitDocStringState

| Event                       | Action             | Destination                                                     |
| --------------------------- | ------------------ | --------------------------------------------------------------- |
| ImplicitDocStringStartEvent | Build & Transition | [ConsumeImplicitDocStringState](#ConsumeImplicitDocStringState) |

#### ConsumeImplicitDocStringState

| Event                      | Action              | Destination                             |
| -------------------------- | ------------------- | --------------------------------------- |
| DocStringTextEvent         | Build               |                                         |
| ImplicitDocStringStopEvent | Transition & Handle | [EndDocStringState](#EndDocStringState) |

#### EndDocStringState

| Event                      | Action            | Destination                                                                                                                        |
| -------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| AnnotationEvent            | Unwind & Dispatch | Previous supporting state ([ContinueBackgroundState](#ContinueBackgroundState) or [ContinueScenarioState](#ContinueScenarioState)) |
| BlankLineEvent             | Absorb            |                                                                                                                                    |
| BlockCommentDelimiterEvent | Transition        | [ConsumeBlockCommentState](#ConsumeBlockCommentState)                                                                              |
| EndEvent                   | Unwind & Dispatch | Previous supporting state ([ContinueScenarioState](#ContinueScenarioState))                                                        |
| ExampleTableEvent          | Unwind & Dispatch | Previous supporting state ([ContinueScenarioState](#ContinueScenarioState))                                                        |
| ScenarioEvent              | Unwind & Dispatch | Previous supporting state ([ContinueBackgroundState](#ContinueBackgroundState) or [ContinueScenarioState](#ContinueScenarioState)) |
| SingleLineComment          | Absorb            |                                                                                                                                    |
| StepEvent                  | Unwind & Dispatch | Previous supporting state ([ContinueBackgroundState](#ContinueBackgroundState) or [ContinueScenarioState](#ContinueScenarioState)) |

#### BeginExampleTableState

| Event                      | Action             | Destination                                                       |
| -------------------------- | ------------------ | ----------------------------------------------------------------- |
| BlankLineEvent             | Absorb             |                                                                   |
| BlockCommentDelimiterEvent | Transition         | [ConsumeBlockCommentState](#ConsumeBlockCommentState)             |
| ExampleTableHeaderRowEvent | Build & Transition | [ConsumeExampleTableHeaderState](#ConsumeExampleTableHeaderState) |
| SingleLineComment          | Absorb             |                                                                   |

#### ConsumeExampleTableHeaderState

| Event                         | Action     | Destination                                                             |
| ----------------------------- | ---------- | ----------------------------------------------------------------------- |
| ExampleTableSeparaterRowEvent | Transition | [ConsumeExampleTableSeparatorState](#ConsumeExampleTableSeparatorState) |

#### ConsumeExampleTableSeparatorState

| Event                      | Action                | Destination                                                         |
| -------------------------- | --------------------- | ------------------------------------------------------------------- |
| AnnotationEvent            | Transition & Dispatch | [ConsumeAnnotationsState](#ConsumeAnnotationsState)                 |
| BlockCommentDelimiterEvent | Transition            | [ConsumeBlockCommentState](#ConsumeBlockCommentState)               |
| ExampleTableDataRowEvent   | Build & Transition    | [ExampleTableDataRowConsumeState](#ExampleTableDataRowConsumeState) |
| SingleLineComment          | Absorb                |                                                                     |

#### ConsumeExampleTableDataState

| Event                      | Action                | Destination                                                                 |
| -------------------------- | --------------------- | --------------------------------------------------------------------------- |
| AnnotationEvent            | Transition & Dispatch | [ConsumeAnnotationsState](#ConsumeAnnotationsState)                         |
| BlankLineEvent             | Transition            | [EndExampleTableState](#EndExampleTableState)                               |
| BlockCommentDelimiterEvent | Transition            | [ConsumeBlockCommentState](#ConsumeBlockCommentState)                       |
| EndEvent                   | Unwind & Dispatch     | Previous supporting state ([ContinueScenarioState](#ContinueScenarioState)) |
| ExampleTableDataRowEvent   | Build                 |                                                                             |
| ScenarioEvent              | Unwind & Dispatch     | Previous supporting state ([ContinueScenarioState](#ContinueScenarioState)) |
| SingleLineComment          | Absorb                |                                                                             |

#### EndExampleTableState

| Event                      | Action                | Destination                                                                               |
| -------------------------- | --------------------- | ----------------------------------------------------------------------------------------- |
| AnnotationEvent            | Transition & Dispatch | [ConsumeAnnotationsState](#ConsumeAnnotationsState)                                       |
| BlankLineEvent             | Absorb                |                                                                                           |
| BlockCommentDelimiterEvent | Transition            | [ConsumeBlockCommentState](#ConsumeBlockCommentState)                                     |
| EndEvent                   | Unwind & Dispatch     | Previous supporting state ([ConsumeExampleTableDataState](#ConsumeExampleTableDataState)) |
| ScenarioEvent              | Unwind & Dispatch     | Previous supporting state ([ContinueScenarioState](#ContinueScenarioState))               |
| SingleLineComment          | Absorb                |                                                                                           |

#### ConsumeBlockCommentState

| Event                      | Action     | Destination                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BlockCommentDelimiterEvent | Transition | Previous supporting state ([BeginBackgroundState](#BeginBackgroundState), [BeginFeatureState](#BeginFeatureState), [ConsumeAnnotationsState](#ConsumeAnnotationsState), [ContinueBackgroundState](#ContinueBackgroundState), [BeginExampleTableState](#BeginExampleTableState), [BeginScenarioState](#BeginScenarioState), [BeginScenariosState](#BeginScenariosState), [ConsumeExampleTableDataState](#ConsumeExampleTableDataState), [ConsumeExampleTableSeparatorState](#ConsumeExampleTableSeparatorState), [ContinueScenarioState](#ContinueScenarioState), [ConsumeStepsState](#ConsumeStepsState), [EndDocStringState](#EndDocStringState) or [EndExampleTableState](#EndExampleTableState)) |
| TextEvent                  | Absorb     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

#### EndFeatureState

No more possible events or actions

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
| Docstring                    | Yes                                            |

## State Machine

The parser uses a state machine which transitions between states in response to certain events. The event are determined by asking the current state whether it can handle a line of text from the feature specification. The state maintains a list of potential events, which it asks to handle the line of text. The first event that supports the line of text, will parse the text and dispatch the event data to the current state. If no event accepts the line of text, then a MissingEventHandler event is dispatched instead.

When handling an event, the state may do one or more of the following

- Use the event data to construct an internal representation of the feature
- Ask the state machine to transition to a new state
- Forward the event data to the new state

For example, the state machine starts off in the [Initial State](#InitialState). If the first line of text in the feature specifciation is `@skip` then this will be intercepted by the [Initial State's](#InitialState) AnnotationEvent. The AnnotationEvent will parse the text, resulting in the following event data `{ name: "skip", value: true }`. The event data will be dispatched to the [Initial State's](#InitialState) `onAnnotation` event handler, which will ask the state machine to move to the [Annotation State](#AnnotationState) before invoking the Annotation State's `onAnnotation` event handler with the same event data. The [Annotation State's](#AnnotationState) `onAnnotation` event handler will ask the FeatureBuilder to stash the annotation data, until such time as a feature is created.

### Events

| Name                        | Examples                                                                                        |
| --------------------------- | ----------------------------------------------------------------------------------------------- |
| AnnotationEvent             | @skip<br/>@timeout=1000                                                                         |
| BackgroundEvent             | Background:<br/>Background: Introduction                                                        |
| BlankLineEvent              |                                                                                                 |
| BlockCommentDelimiterEvent  | ###                                                                                             |
| DocStringTextEvent          | This is a line in a docstring                                                                   |
| EndEvent                    | \u0000 _(automatically appended by the feature parser)_                                         |
| ExampleTableEvent           | Where:                                                                                          |
| ExampleTableHeaderRow       | \| height \| width \|                                                                           |
| ExampleTableSeparatorRow    | \|--------\|---------\|                                                                         |
| ExampleTableDataRow         | \|&nbsp;&nbsp;10cm&nbsp;&nbsp;\|&nbsp;&nbsp;20cm&nbsp;&nbsp;\|                                  |
| ExplicitDocStringStartEvent | ---</br>"""</br>                                                                                |
| ExplicitDocStringStopEvent  | ---</br>"""</br>                                                                                |
| FeatureEvent                | Feature:<br/>Feature: Buck Rogers - Season One                                                  |
| ImplicitDocStringStartEvent | &nbsp;&nbsp;&nbsp;This&nbsp;is&nbsp;the&nbsp;start&nbsp;of&nbsp;an&nbsp;indented&nbsp;docstring |
| ImplicitDocStringStopEvent  | This&nbsp;is&nbsp;the&nbsp;start&nbsp;of&nbsp;an&nbsp;indented&nbsp;docstring                   |
| ScenarioEvent               | Scenario:<br/>Scenario: Awakening                                                               |
| SingleLineCommentEvent      | # This is a comment                                                                             |
| StepEvent                   | This is a step                                                                                  |
| TextEvent                   | This is some text                                                                               |

### States

#### InitialState

InitialState [AnnotationEvent] ⇨ Forward to [AnnotationState](#AnnotationState)</br>
InitialState [BlankLineEvent] ⇨ InitialState</br>
InitialState [BlockCommentDelimiterEvent] ⇨ [BlockCommentState](#BlockCommentState)</br>
InitialState [FeatureEvent] ⇨ [FeatureState](#FeatureState)</br>
InitialState [SingleLineComment] ⇨ InitialState</br>

#### AnnotationState

AnnotationState [AnnotationEvent] ⇨ AnnotationState</br>
AnnotationState [BlankLineEvent] ⇨ AnnotationState</br>
AnnotationState [BackgroundEvent] ⇨ Forward to $PreviousState</br>
AnnotationState [BlockCommentDelimiterEvent] ⇨ [BlockCommentState](#BlockCommentState)</br>
AnnotationState [ExampleTableDataRowEvent] ⇨ Forward to $PreviousState</br>
AnnotationState [FeatureEvent] ⇨ Forward to $PreviousState</br>
AnnotationState [ScenarioEvent] ⇨ Forward to $PreviousState</br>
AnnotationState [SingleLineComment] ⇨ AnnotationState</br>
AnnotationState [StepEvent] ⇨ Forward to $PreviousState</br>

#### FeatureState

FeatureState [AnnotationEvent] ⇨ [AnnotationState](#AnnotationState)</br>
FeatureState [BackgroundEvent] ⇨ [BackgroundStateA](#BackgroundStateA)</br>
FeatureState [BlankLineEvent] ⇨ FeatureState</br>
FeatureState [BlockCommentDelimiterEvent] ⇨ [BlockCommentState](#BlockCommentState)</br>
FeatureState [ScenarioEvent] ⇨ [ScenarioStateA](#ScenarioStateA)</br>
FeatureState [SingleLineComment] ⇨ FeatureState</br>
FeatureState [TextEvent] ⇨ FeatureState</br>

#### BackgroundStateA

BackgroundStateA [AnnotationEvent] ⇨ [AnnotationState](#AnnotationState)</br>
BackgroundStateA [BlankLineEvent] ⇨ BackgroundStateA</br>
BackgroundStateA [BlockCommentDelimiterEvent] ⇨ [BlockCommentState](#BlockCommentState)</br>
BackgroundStateA [SingleLineComment] ⇨ BackgroundStateA</br>
BackgroundStateA [StepEvent] ⇨ Forward to [BackgroundStateB](#BackgroundStateB)</br>

#### BackgroundStateB

BackgroundStateB [AnnotationEvent] ⇨ [AnnotationState](#AnnotationState)</br>
BackgroundStateB [BlankLineEvent] ⇨ BackgroundStateB</br>
BackgroundStateB [BlockCommentDelimiterEvent] ⇨ [BlockCommentState](#BlockCommentState)</br>
BackgroundStateB [ScenarioEvent] ⇨ ScenarioStateA</br>
BackgroundStateB [SingleLineComment] ⇨ BackgroundStateB</br>
BackgroundStateB [StepEvent] ⇨ [StepState](#StepState)</br>

#### ScenarioStateA

ScenarioState [AnnotationEvent] ⇨ [AnnotationState](#AnnotationState)</br>
ScenarioState [BlankLineEvent] ⇨ ScenarioStateA</br>
ScenarioState [BlockCommentDelimiterEvent] ⇨ [BlockCommentState](#BlockCommentState)</br>
ScenarioState [SingleLineComment] ⇨ ScenarioStateA</br>
ScenarioState [StepEvent] ⇨ [ScenarioStateB](#ScenarioStateB)</br>

#### ScenarioStateB

ScenarioState [AnnotationEvent] ⇨ [AnnotationState](#AnnotationState)</br>
ScenarioState [BlankLineEvent] ⇨ ScenarioStateB</br>
ScenarioState [BlockCommentDelimiterEvent] ⇨ [BlockCommentState](#BlockCommentState)</br>
ScenarioState [EndEvent] ⇨ Forward to $PreviousState</br>
ScenarioState [ScenarioEvent] ⇨ ScenarioStateB</br>
ScenarioState [SingleLineComment] ⇨ ScenarioStateB</br>
ScenarioState [StepEvent] ⇨ [StepState](#StepState)</br>

#### StepState

StepState [AnnotationEvent] ⇨ Forward to $PreviousState</br>
StepState [BlankLineEvent] ⇨ StepState</br>
StepState [BlockCommentDelimiterEvent] ⇨ [BlockCommentState](#BlockCommentState)</br>
StepState [EndEvent] ⇨ Forward to $PreviousState</br>
StepState [ExampleTableEvent] ⇨ Forward to $PreviousState</br>
StepState [ExplicitDocStringStartEvent] ⇨ [ExplicitDocStringStartState](#ExplicitDocStringStartState)</br>
StepState [ImplicitDocStringStartEvent] ⇨ [ImplicitDocStringState](#ImplicitDocStringState)</br>
StepState [ScenarioEvent] ⇨ Forward to $PreviousState</br>
StepState [SingleLineComment] ⇨ StepState</br>
StepState [StepEvent] ⇨ Forward to $PreviousState</br>

#### ExplicitDocStringStartState

ExplicitDocStringStartState [DocStringTextEvent] ⇨ [ExplicitDocStringState](#ExplicitDocStringState)</br>

#### ExplicitDocStringState

ExplicitDocStringState [DocStringTextEvent] ⇨ ExplicitDocStringState</br>
ExplicitDocStringState [ExplicitDocStringStopEvent] ⇨ $PreviousState([StepState](#StepState))</br>

#### ImplicitDocStringState

ImplicitDocStringState [DocStringTextEvent] ⇨ ImplicitDocStringState</br>
ImplicitDocStringState [ImplicitDocStringStopEvent] ⇨ $PreviousState([StepState](#StepState))</br>

#### ExampleTableState

ExampleTableState [BlankLineEvent] ⇨ ExampleTableState</br>
ExampleTableState [BlockCommentDelimiterEvent] ⇨ [BlockCommentState](#BlockCommentState)</br>
ExampleTableState [ExampleTableHeaderRowEvent] ⇨ [ExampleTableHeaderState](#ExampleTableHeaderState)</br>
ExampleTableState [SingleLineComment] ⇨ ExampleTableState</br>

#### ExampleTableHeaderState

ExampleTableHeaderState [ExampleTableSeparaterRowEvent] ⇨ [ExampleTableSeparatorState](#ExampleTableSeparatorState)</br>

#### ExampleTableSeparatorState

ExampleTableSeparatorState [AnnotationEvent] ⇨ [AnnotationState](#AnnotationState)</br>
ExampleTableSeparatorState [ExampleTableDataRowEvent] ⇨ [ExampleTableDataRow](#ExampleTableDataRow)</br>

#### ExampleTableDataRow

ExampleTableDataRow [AnnotationEvent] ⇨ [AnnotationState](#AnnotationState)</br>
ExampleTableDataRow [ExampleTableDataRowEvent] ⇨ ExampleTableDataRow</br>
ExampleTableDataRow [EndEvent] ⇨ FinalState</br>
ExampleTableDataRow [ScenarioEvent] ⇨ [ScenarioState](#ScenarioState)</br>

#### BlockCommentState

BlockCommentState [BlockCommentDelimiterEvent] ⇨ $PreviousState</br>
BlockCommentState [TextEvent] ⇨ BlockCommentState</br>

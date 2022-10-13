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

The parser uses a state machine which transitions between states when specific events are dispatched.

### Events

| Name                       | Examples                                                       |                                              |
| -------------------------- | -------------------------------------------------------------- | -------------------------------------------- |
| AnnotationEvent            | @skip<br/>@timeout=1000                                        |                                              |
| BackgroundEvent            | Background:<br/>Background: Title                              |                                              |
| BlankLineEvent             |                                                                |                                              |
| BlockCommentDelimiterEvent | ###                                                            |                                              |
| DocStringDelimiterEvent    | '''</br>"""</br>                                               |                                              |
| DocStringIndentEvent       | &nbsp;&nbsp;&nbsp;This is an indented docstring                |                                              |
| DocStringTextEvent         | This is a docstring                                            |                                              |
| EndEvent                   | \u0000                                                         | Automatically appended by the feature parser |
| ExampleTableEvent          | Where:                                                         |                                              |
| ExampleTableHeaderRow      | \| height \| width \|                                          |                                              |
| ExampleTableSeparatorRow   | \|--------\|---------\|                                        |                                              |
| ExampleTableDataRow        | \|&nbsp;&nbsp;10cm&nbsp;&nbsp;\|&nbsp;&nbsp;20cm&nbsp;&nbsp;\| |                                              |
| FeatureEvent               | Feature:<br/>Feature: Title                                    |                                              |
| ScenarioEvent              | Scenario:<br/>Scenario: Title                                  |                                              |
| SingleLineCommentEvent     | # This is a comment                                            |                                              |
| StepEvent                  | This is a step                                                 |                                              |
| TextEvent                  | This is some text                                              |                                              |

### States

#### InitialState

InitialState [AnnotationEvent] ⇨ InitialState</br>
InitialState [BlankLineEvent] ⇨ InitialState</br>
InitialState [BlockCommentDelimiterEvent] ⇨ [BlockCommentState](#BlockCommentState)</br>
InitialState [FeatureEvent] ⇨ [FeatureState](#FeatureState)</br>
InitialState [SingleLineComment] ⇨ InitialState</br>

#### FeatureState

FeatureState [AnnotationEvent] ⇨ FeatureState</br>
FeatureState [BackgroundEvent] ⇨ [BackgroundState](#BackgroundState)</br>
FeatureState [BlankLineEvent] ⇨ FeatureState</br>
FeatureState [BlockCommentDelimiterEvent] ⇨ [BlockCommentState](#BlockCommentState)</br>
FeatureState [ScenarioEvent] ⇨ [ScenarioState](#ScenarioState)</br>
FeatureState [SingleLineComment] ⇨ FeatureState</br>
FeatureState [TextEvent] ⇨ FeatureState</br>

#### BackgroundState

BackgroundState [AnnotationEvent] ⇨ BackgroundState</br>
BackgroundState [BlankLineEvent] ⇨ BackgroundState</br>
BackgroundState [BlockCommentDelimiterEvent] ⇨ [BlockCommentState](#BlockCommentState)</br>
BackgroundState [SingleLineComment] ⇨ BackgroundState</br>
BackgroundState [StepEvent] ⇨ [BackgroundStepsState](#BackgroundStepsState)</br>

#### BackgroundStepsState

BackgroundStepsState [AnnotationEvent] ⇨ StepsAnnotationState</br>
BackgroundStepsState [BlankLineEvent] ⇨ BackgroundStepsState</br>
BackgroundStepsState [BlockCommentDelimiterEvent] ⇨ [BlockCommentState](#BlockCommentState)</br>
BackgroundStepsState [DocStringDelimiterEvent] ⇨ [ExplicitDocStringStartState](#ExplicitDocStringStartState)</br>
BackgroundStepsState [DocStringIndentEvent] ⇨ [ImplicitDocStringState](#ImplicitDocStringState)</br>
BackgroundStepsState [ScenarioEvent] ⇨ [ScenarioState](#ScenarioState)</br>
BackgroundStepsState [SingleLineComment] ⇨ BackgroundStepsState</br>
BackgroundStepsState [StepEvent] ⇨ BackgroundStepsState</br>

#### ScenarioState

ScenarioState [AnnotationEvent] ⇨ ScenarioState</br>
ScenarioState [BlankLineEvent] ⇨ ScenarioState</br>
ScenarioState [BlockCommentDelimiterEvent] ⇨ [BlockCommentState](#BlockCommentState)</br>
ScenarioState [SingleLineComment] ⇨ ScenarioState</br>
ScenarioState [StepEvent] ⇨ [ScenarioStepsState](#ScenarioStepsState)</br>

#### ScenarioStepsState

ScenarioStepsState [AnnotationEvent] ⇨ ScenarioStepsState</br>
ScenarioStepsState [BlankLineEvent] ⇨ ScenarioStepsState</br>
ScenarioStepsState [BlockCommentDelimiterEvent] ⇨ [BlockCommentState](#BlockCommentState)</br>
ScenarioStepsState [DocStringDelimiterEvent] ⇨ [ExplicitDocStringStartState](#ExplicitDocStringStartState)</br>
ScenarioStepsState [DocStringIndentEvent] ⇨ [ImplicitDocStringState](#ImplicitDocStringState)</br>
ScenarioStepsState [ExampleTableEvent] ⇨ [ExampleTableState](#ExampleTableState)</br>
ScenarioStepsState [ScenarioEvent] ⇨ [ScenarioState](#ScenarioState)</br>
ScenarioStepsState [SingleLineComment] ⇨ ScenarioStepsState</br>
ScenarioStepsState [StepEvent] ⇨ ScenarioStepsState</br>
ScenarioStepsState [EndEvent] ⇨ FinalState</br>

#### StepsAnnotationState

StepsAnnotationState [AnnotationEvent] ⇨ StepsAnnotationState</br>
StepsAnnotationState [BlankLineEvent] ⇨ StepsAnnotationState</br>
StepsAnnotationState [BlockCommentDelimiterEvent] ⇨ [BlockCommentState](#BlockCommentState)</br>
StepsAnnotationState [ScenarioEvent] ⇨ [ScenarioState](#ScenarioState)</br>
StepsAnnotationState [SingleLineComment] ⇨ StepsAnnotationState</br>
StepsAnnotationState [StepEvent] ⇨ [BackgroundStepsState](#BackgroundStepsState) | [ScenarioStepsState](ScenarioStepsState)</br>

#### ExplicitDocStringStartState

ExplicitDocStringStartState [DocStringTextEvent] ⇨ [ExplicitDocStringState](#ExplicitDocStringState)</br>

#### ExplicitDocStringState

ExplicitDocStringState [DocStringTextEvent] ⇨ ExplicitDocStringState</br>
ExplicitDocStringState [DocStringDelimiterEvent] ⇨ [BackgroundStepsState](#BackgroundStepsState) | [ScenarioStepsState](ScenarioStepsState)</br>

#### ImplicitDocStringState

ImplicitDocStringState [DocStringTextEvent] ⇨ ImplicitDocStringState</br>
ImplicitDocStringState [DocStringOutdentEvent] ⇨ [BackgroundStepsState](#BackgroundStepsState) | [ScenarioStepsState](ScenarioStepsState)</br>

#### ExampleTableState

ExampleTableState [BlankLineEvent] ⇨ ExampleTableState</br>
ExampleTableState [BlockCommentDelimiterEvent] ⇨ [BlockCommentState](#BlockCommentState)</br>
ExampleTableState [ExampleTableHeaderRowEvent] ⇨ [ExampleTableHeaderState](#ExampleTableHeaderState)</br>
ExampleTableState [SingleLineComment] ⇨ ExampleTableState</br>

#### ExampleTableHeaderState

ExampleTableHeaderState [ExampleTableSeparaterRowEvent] ⇨ [ExampleTableSeparatorState](#ExampleTableSeparatorState)</br>

#### ExampleTableSeparatorState

ExampleTableSeparatorState [AnnotationEvent] ⇨ ExampleTableSeparatorState</br>
ExampleTableSeparatorState [ExampleTableDataRowEvent] ⇨ [ExampleTableDataRow](#ExampleTableDataRow)</br>

#### ExampleTableDataRow

ExampleTableDataRow [ExampleTableDataRowEvent] ⇨ ExampleTableDataRow</br>
ExampleTableDataRow [EndEvent] ⇨ FinalState</br>
ExampleTableDataRow [ScenarioEvent] ⇨ [ScenarioState](#ScenarioState)</br>

#### BlockCommentState

BlockCommentState [BlockCommentDelimiterEvent] ⇨ $PreviousState</br>
BlockCommentState [TextEvent] ⇨ BlockCommentState</br>

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

### States

##### InitialState

InitialState [AnnotationEvent] ⇨ InitialState
InitialState [BlankLineEvent] ⇨ InitialState
InitialState [BlockCommentEvent] ⇨ [BlockCommentState](#BlockCommentState)
InitialState [FeatureEvent] ⇨ [FeatureState](#[FeatureState])
InitialState [SingleLineComment] ⇨ InitialState

##### FeatureState

FeatureState [AnnotationEvent] ⇨ FeatureState
FeatureState [BackgroundEvent] ⇨ [BackgroundState](#BackgroundState)
FeatureState [BlankLineEvent] ⇨ FeatureState
FeatureState [BlockCommentEvent] ⇨ [BlockCommentState](#BlockCommentState)
FeatureState [ScenarioEvent] ⇨ [ScenarioState](#ScenarioState)
FeatureState [SingleLineComment] ⇨ FeatureState
FeatureState [TextEvent] ⇨ FeatureState

##### BackgroundState

BackgroundState [AnnotationEvent] ⇨ BackgroundState</br>
BackgroundState [BlankLineEvent] ⇨ BackgroundState</br>
BackgroundState [BlockCommentEvent] ⇨ [BlockCommentState](#BlockCommentState)</br>
BackgroundState [SingleLineComment] ⇨ BackgroundState</br>
BackgroundState [StepEvent] ⇨ [BackgroundStepsState](#BackgroundStepsState)</br>

##### BackgroundStepsState

BackgroundStepsState [AnnotationEvent] ⇨ BackgroundStepsState</br>
BackgroundStepsState [BlankLineEvent] ⇨ BackgroundStepsState</br>
BackgroundStepsState [BlockCommentEvent] ⇨ [BlockCommentState](#BlockCommentState)</br>
BackgroundStepsState [DocStringDelimiterEvent] ⇨ [ExplicitDocStringStartState](#ExplicitDocStringStartState)</br>
BackgroundStepsState [DocStringIndentEvent] ⇨ [ImplicitDocStringState](#ImplicitDocStringState)</br>
BackgroundStepsState [ScenarioEvent] ⇨ [ScenarioState](#ScenarioState)</br>
BackgroundStepsState [StepEvent] ⇨ BackgroundStepsState</br>
BackgroundStepsState [SingleLineComment] ⇨ BackgroundStepsState</br>

##### BackgroundStepsAnnotationState

BackgroundStepsAnnotationState [AnnotationEvent] ⇨ BackgroundStepsAnnotationState</br>
BackgroundStepsAnnotationState [BlankLineEvent] ⇨ BackgroundStepsAnnotationState</br>
BackgroundStepsAnnotationState [BlockCommentEvent] ⇨ [BlockCommentState](#BlockCommentState)</br>
BackgroundStepsAnnotationState [ScenarioEvent] ⇨ [ScenarioState](#ScenarioState)</br>
BackgroundStepsAnnotationState [SingleLineComment] ⇨ BackgroundStepsAnnotationState</br>
BackgroundStepsAnnotationState [StepEvent] ⇨ BackgroundStepsAnnotationState</br>

##### ScenarioState

ScenarioState [AnnotationEvent] ⇨ ScenarioState</br>
ScenarioState [BlankLineEvent] ⇨ ScenarioState</br>
ScenarioState [BlockCommentEvent] ⇨ [BlockCommentState](#BlockCommentState)</br>
ScenarioState [SingleLineComment] ⇨ ScenarioState</br>
ScenarioState [StepEvent] ⇨ [ScenarioStepsState](#ScenarioStepsState)</br>

##### ScenarioStepsState

ScenarioStepsState [AnnotationEvent] ⇨ ScenarioStepsState</br>
ScenarioStepsState [BlankLineEvent] ⇨ ScenarioStepsState</br>
ScenarioStepsState [BlockCommentEvent] ⇨ [BlockCommentState](#BlockCommentState)</br>
ScenarioStepsState [DocStringDelimiterEvent] ⇨ [ExplicitDocStringStartState](#ExplicitDocStringStartState)</br>
ScenarioStepsState [DocStringIndentEvent] ⇨ [ImplicitDocStringState](#ImplicitDocStringState)</br>
ScenarioStepsState [ScenarioEvent] ⇨ [ScenarioState](#ScenarioState)</br>
ScenarioStepsState [StepEvent] ⇨ ScenarioStepsState</br>
ScenarioStepsState [ExampleTableEvent] ⇨ [ExampleTableState](#ExampleTableState)</br>
ScenarioStepsState [SingleLineComment] ⇨ ScenarioStepsState</br>
ScenarioStepsState [EndEvent] ⇨ [FinalState](#FinalState)</br>

##### ScenarioStepsAnnotationState

ScenarioStepsAnnotationState [AnnotationEvent] ⇨ ScenarioStepsAnnotationState</br>
ScenarioStepsAnnotationState [BlankLineEvent] ⇨ ScenarioStepsAnnotationState</br>
ScenarioStepsAnnotationState [BlockCommentEvent] ⇨ [BlockCommentState](#BlockCommentState)</br>
ScenarioStepsAnnotationState [ScenarioEvent] ⇨ [ScenarioState](#ScenarioState)</br>
ScenarioStepsAnnotationState [StepEvent] ⇨ ScenarioStepsAnnotationState</br>
ScenarioStepsAnnotationState [SingleLineComment] ⇨ ScenarioStepsAnnotationState</br>

##### ExplicitDocStringStartState

ExplicitDocStringStartState [DocStringLineEvent] ⇨ [ExplicitDocStringState](#ExplicitDocStringState)</br>

##### ExplicitDocStringState

ExplicitDocStringState [DocStringLineEvent] ⇨ ExplicitDocStringState</br>
ExplicitDocStringState [DocStringDelimiterEvent] ⇨ [BackgroundStepsState | ScenarioStepsState](#BackgroundStepsState | ScenarioStepsState)</br>

##### ImplicitDocStringState

ImplicitDocStringState [DocStringLineEvent] ⇨ ImplicitDocStringState</br>
ImplicitDocStringState [DocStringOutdentEvent] ⇨ [BackgroundStepsState | ScenarioStepsState](#BackgroundStepsState | ScenarioStepsState)</br>

##### ExampleTableState

ExampleTableState [BlankLineEvent] ⇨ ExampleTableState</br>
ExampleTableState [BlockCommentEvent] ⇨ [BlockCommentState](#BlockCommentState)</br>
ExampleTableState [ExampleTableHeaderRowEvent] ⇨ [ExampleTableHeaderState](#ExampleTableHeaderState)</br>
ExampleTableState [SingleLineComment] ⇨ ExampleTableState</br>

##### ExampleTableHeaderState

ExampleTableHeaderState [ExampleTableSeparaterRowEvent] ⇨ [ExampleTableSeparatorState](#ExampleTableSeparatorState)</br>

##### ExampleTableSeparatorState

ExampleTableSeparatorState [AnnotationEvent] ⇨ ExampleTableSeparatorState</br>
ExampleTableSeparatorState [ExampleTableDataRowEvent] ⇨ [ExampleTableDataRow](#ExampleTableDataRow)</br>

##### ExampleTableDataRow

ExampleTableDataRow [ExampleTableDataRowEvent] ⇨ ExampleTableDataRow</br>
ExampleTableDataRow [EndEvent] ⇨ [FinalState](#FinalState)</br>
ExampleTableDataRow [ScenarioEvent] ⇨ [ScenarioState](#ScenarioState)</br>

##### BlockCommentState

BlockCommentState [BlockCommentEvent] ⇨ $PreviousState</br>
BlockCommentState [TextEvent] ⇨ BlockCommentState</br>

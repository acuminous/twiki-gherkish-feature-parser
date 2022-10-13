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

InitialState [AnnotationEvent] -> [InitialState](#InitialState)
InitialState [BlankLineEvent] -> [InitialState](#InitialState)
InitialState [BlockCommentEvent] -> [BlockCommentState](#BlockCommentState)
InitialState [FeatureEvent] -> [[FeatureState]](#[FeatureState])
InitialState [SingleLineComment] -> [InitialState](#InitialState)

##### FeatureState

FeatureState [AnnotationEvent] -> [FeatureState](#FeatureState)
FeatureState [BackgroundEvent] -> [BackgroundState](#BackgroundState)
FeatureState [BlankLineEvent] -> [FeatureState](#FeatureState)
FeatureState [BlockCommentEvent] -> [BlockCommentState](#BlockCommentState)
FeatureState [ScenarioEvent] -> [ScenarioState](#ScenarioState)
FeatureState [SingleLineComment] -> [FeatureState](#FeatureState)
FeatureState [TextEvent] -> [FeatureState](#FeatureState)

##### BackgroundState

BackgroundState [AnnotationEvent] -> [BackgroundState](#BackgroundState)
BackgroundState [BlankLineEvent] -> [BackgroundState](#BackgroundState)
BackgroundState [BlockCommentEvent] -> [BlockCommentState](#BlockCommentState)
BackgroundState [SingleLineComment] -> [BackgroundState](#BackgroundState)
BackgroundState [StepEvent] -> [BackgroundStepsState](#BackgroundStepsState)

##### BackgroundStepsState

BackgroundStepsState [AnnotationEvent] -> [BackgroundStepsState](#BackgroundStepsState)
BackgroundStepsState [BlankLineEvent] -> [BackgroundStepsState](#BackgroundStepsState)
BackgroundStepsState [BlockCommentEvent] -> [BlockCommentState](#BlockCommentState)
BackgroundStepsState [DocStringDelimiterEvent] -> [ExplicitDocStringStartState](#ExplicitDocStringStartState)
BackgroundStepsState [DocStringIndentEvent] -> [ImplicitDocStringState](#ImplicitDocStringState)
BackgroundStepsState [ScenarioEvent] -> [ScenarioState](#ScenarioState)
BackgroundStepsState [StepEvent] -> [BackgroundStepsState](#BackgroundStepsState)
BackgroundStepsState [SingleLineComment] -> [BackgroundStepsState](#BackgroundStepsState)

##### BackgroundStepsAnnotationState

BackgroundStepsAnnotationState [AnnotationEvent] -> [BackgroundStepsAnnotationState](#BackgroundStepsAnnotationState)
BackgroundStepsAnnotationState [BlankLineEvent] -> [BackgroundStepsAnnotationState](#BackgroundStepsAnnotationState)
BackgroundStepsAnnotationState [BlockCommentEvent] -> [BlockCommentState](#BlockCommentState)
BackgroundStepsAnnotationState [ScenarioEvent] -> [ScenarioState](#ScenarioState)
BackgroundStepsAnnotationState [StepEvent] -> [BackgroundStepsAnnotationState](#BackgroundStepsAnnotationState)
BackgroundStepsAnnotationState [SingleLineComment] -> [BackgroundStepsAnnotationState](#BackgroundStepsAnnotationState)

##### ScenarioState

ScenarioState [AnnotationEvent] -> [ScenarioState](#ScenarioState)
ScenarioState [BlankLineEvent] -> [ScenarioState](#ScenarioState)
ScenarioState [BlockCommentEvent] -> [BlockCommentState](#BlockCommentState)
ScenarioState [SingleLineComment] -> [ScenarioState](#ScenarioState)
ScenarioState [StepEvent] -> [ScenarioStepsState](#ScenarioStepsState)

##### ScenarioStepsState

ScenarioStepsState [AnnotationEvent] -> [ScenarioStepsState](#ScenarioStepsState)
ScenarioStepsState [BlankLineEvent] -> [ScenarioStepsState](#ScenarioStepsState)
ScenarioStepsState [BlockCommentEvent] -> [BlockCommentState](#BlockCommentState)
ScenarioStepsState [DocStringDelimiterEvent] -> [ExplicitDocStringStartState](#ExplicitDocStringStartState)
ScenarioStepsState [DocStringIndentEvent] -> [ImplicitDocStringState](#ImplicitDocStringState)
ScenarioStepsState [ScenarioEvent] -> [ScenarioState](#ScenarioState)
ScenarioStepsState [StepEvent] -> [ScenarioStepsState](#ScenarioStepsState)
ScenarioStepsState [ExampleTableEvent] -> [ExampleTableState](#ExampleTableState)
ScenarioStepsState [SingleLineComment] -> [ScenarioStepsState](#ScenarioStepsState)
ScenarioStepsState [EndEvent] -> [FinalState](#FinalState)

##### ScenarioStepsAnnotationState

ScenarioStepsAnnotationState [AnnotationEvent] -> [ScenarioStepsAnnotationState](#ScenarioStepsAnnotationState)
ScenarioStepsAnnotationState [BlankLineEvent] -> [ScenarioStepsAnnotationState](#ScenarioStepsAnnotationState)
ScenarioStepsAnnotationState [BlockCommentEvent] -> [BlockCommentState](#BlockCommentState)
ScenarioStepsAnnotationState [ScenarioEvent] -> [ScenarioState](#ScenarioState)
ScenarioStepsAnnotationState [StepEvent] -> [ScenarioStepsAnnotationState](#ScenarioStepsAnnotationState)
ScenarioStepsAnnotationState [SingleLineComment] -> [ScenarioStepsAnnotationState](#ScenarioStepsAnnotationState)

##### ExplicitDocStringStartState

ExplicitDocStringStartState [DocStringLineEvent] -> [ExplicitDocStringState](#ExplicitDocStringState)

##### ExplicitDocStringState

ExplicitDocStringState [DocStringLineEvent] -> [ExplicitDocStringState](#ExplicitDocStringState)
ExplicitDocStringState [DocStringDelimiterEvent] -> [BackgroundStepsState | ScenarioStepsState](#BackgroundStepsState | ScenarioStepsState)

##### ImplicitDocStringState

ImplicitDocStringState [DocStringLineEvent] -> [ImplicitDocStringState](#ImplicitDocStringState)
ImplicitDocStringState [DocStringOutdentEvent] -> [BackgroundStepsState | ScenarioStepsState](#BackgroundStepsState | ScenarioStepsState)

##### ExampleTableState

ExampleTableState [BlankLineEvent] -> [ExampleTableState](#ExampleTableState)
ExampleTableState [BlockCommentEvent] -> [BlockCommentState](#BlockCommentState)
ExampleTableState [ExampleTableHeaderRowEvent] -> [ExampleTableHeaderState](#ExampleTableHeaderState)
ExampleTableState [SingleLineComment] -> [ExampleTableState](#ExampleTableState)

##### ExampleTableHeaderState

ExampleTableHeaderState [ExampleTableSeparaterRowEvent] -> [ExampleTableSeparatorState](#ExampleTableSeparatorState)

##### ExampleTableSeparatorState

ExampleTableSeparatorState [ExampleTableDataRowEvent] -> [ExampleTableDataRow](#ExampleTableDataRow)
ExampleTableSeparatorState [AnnotationEvent] -> [ExampleTableSeparatorState](#ExampleTableSeparatorState)

##### ExampleTableDataRow

ExampleTableDataRow [ExampleTableDataRowEvent] -> [ExampleTableDataRow](#ExampleTableDataRow)
ExampleTableDataRow [EndEvent] -> [FinalState](#FinalState)
ExampleTableDataRow [ScenarioEvent] -> [ScenarioState](#ScenarioState)

##### BlockCommentState

BlockCommentState [BlockCommentEvent] -> $PreviousState
BlockCommentState [TextEvent] -> BlockCommentState

# twiki-gherkish-feature-parser

[![Node.js CI](https://github.com/acuminous/twiki-gherkish-feature-parser/workflows/Node.js%20CI/badge.svg)](https://github.com/acuminous/twiki-gherkish-feature-parser/actions?query=workflow%3A%22Node.js+CI%22)
[![Maintainability](https://api.codeclimate.com/v1/badges/6837424f9e1fc6a634bf/maintainability)](https://codeclimate.com/github/acuminous/twiki-gherkish-feature-parser/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/6837424f9e1fc6a634bf/test_coverage)](https://codeclimate.com/github/acuminous/twiki-gherkish-feature-parser/test_coverage)
[![Tested with zUnit](https://img.shields.io/badge/Tested%20with-zUnit-brightgreen)](https://www.npmjs.com/package/zunit)

A [Gherkin](https://cucumber.io/docs/gherkin/) like feature parser

## TL;DR

```js
import { FeatureParser } from "@twiki-bdd/gherkish-feature-parser";
import * as fs from "node:fs";

const featureFilePath = "./buck-rogers-season-one.feature";
const featureFile = fs.readFileSync(featureFilePath, "utf-8");
const options = {};
const parser = new FeatureParser(options);
const metadata = {
  source: {
    uri: featureFilePath,
  },
};
const feature = parser.parse(featureFile, metadata);
```

## Installation

```
npm install @twiki-bdd/gherkish-feature-parser
```

## Parser Options

| Option   | Notes                                |
| -------- | ------------------------------------ |
| language | A language from the Languages module |

## Supported Languages

- Chinese / 中国人
- Dutch / Nederlands
- English
- French / Français
- German / Deutsch
- Norweigian / Norsk
- Polish / Polski
- Portugeuse / Polski
- Russian / Русский
- Spanish / Español
- Ukrainian / Yкраїнська

## Gherkin Compatability

| Syntax                       | Supported                                      |
| ---------------------------- | ---------------------------------------------- |
| Language directive           | No - use the parser "language" option instead  |
| Feature                      | Yes                                            |
| Feature descriptions         | Yes                                            |
| Feature tags/annotations     | Yes                                            |
| Feature backgrounds          | Yes                                            |
| Background tags/annotations  | Yes                                            |
| Rules                        | Yes                                            |
| Scenario Outlines            | Yes - use "Where:", "Examples:", etc           |
| Scenarios                    | Yes                                            |
| Scenario descriptions        | Yes                                            |
| Scenario tags/annotations    | Yes                                            |
| Steps                        | Yes                                            |
| Step tags/annotations        | Yes                                            |
| Given / When / Then keywords | No - twiki does not special case step keywords |
| Docstring                    | Yes - use """ or ---                           |

## Development

```
git clone git@github.com:acuminous/twiki-gherkish-feature-parser.git
cd twiki-gherkish-feature-parser
npm install
npm test
```

## State Machine

The parser uses a state machine which transitions between states (e.g. InitialState, DeclareFeatureState) in response to specific events (e.g. Annotation, Feature, etc). When encoutering an event, the state may do one or more of the following...

- Use the event data to **build** an internal representation of the feature
- Ask the state machine to **checkpoint** the current state
- Ask the state machine to **alias** the a specific future state, so it can be transitioned to by a shared/common state
- Ask the state machine to **transition** to a new state
- Ask the state machine to **unwind** to a previously checkpointed state
- Ask the state machine to **dispatch** the event again (after transitioning or unwinding)
- Ask the state machine to **interpret** the original line of text again (after transitioning or unwinding)
- **Ignore** the event, i.e. do nothing
- Report an unexpected event
- Report a missing event handler

For example, the state machine starts off in InitialState. If the first line of text in the feature specifciation is `@skip` then this will be translated into an AnnotationEvent. The AnnotationEvent will parse the text, resulting in the following event data: `{ name: "skip", value: true }`. The event and data will be dispatched to the InitialState, which will ask the state machine to checkpoint the current state, transition to the CaptureAnnotationState and redispatch the event. The CaptureAnnotationState will stash the event data using until such time as a feature is created. While the state machine continues to receive annoations, the events will continue to be dispatched to and stashed by the CaptureAnnotationState. However, if the `'Feature:'` keyword is encountered, a FeatureEvent will be dispatched causing the CaptureAnnotationState to unwind to the previously checkpointed InitialState. The FeatureEvent will be redispatched, and handled by the InitialState.

## Events

| Name                        | Data        | Examples                                                                                        |
| --------------------------- | ----------- | ----------------------------------------------------------------------------------------------- |
| AnnotationEvent             | name, value | @skip<br/>@timeout=1000                                                                         |
| BackgroundEvent             | title?      | Background:<br/>Background: Introduction                                                        |
| BlankLineEvent              |             |                                                                                                 |
| BlockCommentDelimiterEvent  |             | ###                                                                                             |
| DocstringTextEvent          | text        | This is a line in a docstring                                                                   |
| EndEvent                    |             | \u0000 _(automatically appended by the feature parser)_                                         |
| ExampleTableEvent           |             | Where:                                                                                          |
| ExampleTableHeaderRow       | headings    | \| height \| width \|                                                                           |
| ExampleTableSeparatorRow    |             | \|--------\|---------\|                                                                         |
| ExampleTableDataRow         | values      | \|&nbsp;&nbsp;10cm&nbsp;&nbsp;\|&nbsp;&nbsp;20cm&nbsp;&nbsp;\|                                  |
| ExplicitDocstringStartEvent |             | ---</br>"""</br>                                                                                |
| ExplicitDocstringStopEvent  |             | ---</br>"""</br>                                                                                |
| FeatureEvent                | title?      | Feature:<br/>Feature: Buck Rogers - Season One                                                  |
| ImplicitDocstringStartEvent |             | &nbsp;&nbsp;&nbsp;This&nbsp;is&nbsp;the&nbsp;start&nbsp;of&nbsp;an&nbsp;indented&nbsp;docstring |
| ImplicitDocstringStopEvent  |             | This&nbsp;is&nbsp;the&nbsp;start&nbsp;of&nbsp;an&nbsp;indented&nbsp;docstring                   |
| RuleEvent                   | title?      | Rule:<br/>Rule: Buck Rogers always wins                                                         |
| ScenarioEvent               | title?      | Scenario:<br/>Scenario: Awakening                                                               |
| SingleLineCommentEvent      |             | # This is a comment                                                                             |
| StepEvent                   | text        | This is a step                                                                                  |
| TextEvent                   | text        | This is some text                                                                               |

## State Transitions

### Legend

<pre>
┌───────────────────────────────────────────┐
│                                           │
│               InitialState                │
│                                           │
│              [valid events]               │
│                                           │
└───────────────────────────────────────────┘

╔═══════════════════════════════════════════╗
║                                           ║
║            A substate machine             ║
║                                           ║
╚═══════════════════════════════════════════╝
</pre>

| Notation            | Example   | Meaning                                           |
| ------------------- | --------- | ------------------------------------------------- |
| A solid line        | `───────` | A state transition                                |
| A dashed line       | `─ ─ ─ ─` | Unwind to the previous checkpoint                 |
| A solid diamond     | `◈`       | Checkpoint the current state before tranistioning |
| A solid arrow head  | `▶`       | Redispatch the event                              |
| A hollow arrow head | `▷`       | Do not redispatch the event                       |
| A solid circle      | `◍`       | Reinterpret the source text                       |

### Capture Feature

<pre>
                        ┌───────────────────────────────────────────┐
                        │                  Initial                  │
                        │                                           │
                        │  [annotation, blank line, block comment   │
                        │ delimiter, feature, single line comment]  │
                        │                                           │
                        └───────────────────────────────────────────┘
                                              │[feature]
                                              │
                                              │
                                              ▽
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                                      Declare Feature                                      │
│                                                                                           │
│ [annotation, background, blank line, block comment delimiter, rule, scenario, single line │
│                                      comment, text]                                       │
│                                                                                           │
└───────────────────────────────────────────────────────────────────────────────────────────┘
           │[background]                      │[rule]                             │[scenario]
           │                                  │                                   │
           │                                  │                                   │
           ▽                                  ▽                                   ▽
╔════════════════════╗             ╔════════════════════╗              ╔════════════════════╗
║                    ║             ║                    ║[scenario]    ║                    ║
║      Capture       ║ [rule]      ║      Capture       ║─────────────▷║      Capture       ║
║ Feature Background ║────────────▷║        Rule        ║              ║      Scenario      ║
║                    ║             ║                    ║        [rule]║                    ║
║                    ║             ║                    ║◁─────────────║                    ║
╚════════════════════╝             ╚════════════════════╝              ╚════════════════════╝
       [scenario]                                                           △     │[end]
           │                                                                │     │
           └────────────────────────────────────────────────────────────────┘     │
                                                                                  │
                                                                                  ▽
                                                                        ┌───────────────────┐
                                                                        │                   │
                                                                        │       Final       │
                                                                        │                   │
                                                                        └───────────────────┘
</pre>

### Capture Feature Background

<pre>
                           │[background]
                           │
                           │
                           │
                           ▽
     ┌───────────────────────────────────────────┐
     │        Declare Feature Background         │
     │                                           │
     │  [annotation, blank line, block comment   │
     │   delimiter, single line comment, step]   │
     │                                           │
     └───────────────────────────────────────────┘
                           │[step]
                           │
                           │
                           ▼
     ┌───────────────────────────────────────────┐
     │      Capture Feature Background Step      │[rule]
     │                                           │─────────────────────▷
     │  [annotation, blank line, block comment   │
┌ ─ ▶│   delimiter, explicit docstring start,    │
     │   implicit docstring start, single line   │[scenario]
│    │      comment, rule, scenario, step]       │─────────────────────▷
     │                                           │
│    └───────────────────────────────────────────┘
         ◈[explicit docstring start]         ◈[implicit docstring start]
│        │                                   │
         │                                   │
│        ▽                                   ●
     ╔═══════════════════════════════════════════╗
│    ║                                           ║
     ║             Capture Docstring             ║
│    ║                                           ║
     ╚═══════════════════════════════════════════╝
│        │[explicit docstring end]           │[implicit docstring end]
         │                                   │
│        │                                   │
         ▽                                   ●
│    ┌───────────────────────────────────────────┐
     │     End Feature Background Docstring      │
│    │                                           │
     │  [annotation, blank line, block comment,  │
│    │rule, scenario, single line comment, step] │
     │                                           │
│    └───────────────────────────────────────────┘
                           │[annotation, blank line, block
│                           comment delimiter, single line
                           │comment, rule, scenario, step]
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
</pre>

### Capture Rule

<pre>
                           │[rule]
                           │
                           │
                           │
                           ▽
     ┌───────────────────────────────────────────┐
     │               Declare Rule                │
     │                                           │
     │[annotation, background, blank line, block │[scenario]
     │ comment delimiter, scenario, single line  │─────────────────────▷
     │              comment, text]               │
     │                                           │
     └───────────────────────────────────────────┘
                           │[background]
                           │
                           │
                           ▼
     ┌───────────────────────────────────────────┐
     │          Declare Rule Background          │
     │                                           │
     │  [annotation, blank line, block comment   │
     │   delimiter, single line comment, step]   │
     │                                           │
     └───────────────────────────────────────────┘
                           │[step]
                           │
                           │
                           ▼
     ┌───────────────────────────────────────────┐
     │       Capture Rule Background Step        │
     │                                           │
     │  [annotation, blank line, block comment   │[scenario]
 ─ ─▶│   delimiter, explicit docstring start,    │─────────────────────▷
│    │   implicit docstring start, single line   │
     │         comment, scenario, step]          │
│    │                                           │
     └───────────────────────────────────────────┘
│        ◈[explicit docstring start]         ◈[implicit docstring start]
         │                                   │
│        │                                   │
         │                                   │
│        ▼                                   ▼
     ╔═══════════════════════════════════════════╗
│    ║                                           ║
     ║             Capture Docstring             ║
│    ║                                           ║
     ╚═══════════════════════════════════════════╝
│        │[explicit docstring end]           │[implicit docstring end]
         │                                   │
│        │                                   │
         ▽                                   ●
│    ┌───────────────────────────────────────────┐
     │       End Rule Background Docstring       │
│    │                                           │
     │  [annotation, blank line, block comment,  │
│    │   scenario, single line comment, step]    │
     │                                           │
│    └───────────────────────────────────────────┘
                           │[annotation, blank line, block
│                           comment delimiter, single line
                           │comment, scenario, step]
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
</pre>

### Capture Scenario

<pre>
                                            │ [scenario]
                                            │
                                            │
                                            │
                                            ▽
                      ┌───────────────────────────────────────────┐
                      │             Declare Scenario              │
                      │                                           │
                      │  [annotation, blank line, block comment   │
                      │   delimiter, single line comment, step]   │
                      │                                           │
                      └───────────────────────────────────────────┘
                                            │[step]
                                            │
                                            │
                                            ▼
     ┌────────────────────────────────────────────────────────────────────────────┐
     │                                                                            │[rule, scenario, end]
     │                           Capture Scenario Step                            │─────────────────────▷
     │                                                                            │
     │   [annotation, blank line, block comment delimiter, end, example table,    │
 ─ ─▶│  explicit docstring start, implicit docstring start, single line comment,  │◀ ─ ─ ─ ─ ─ ─ ┐
│    │                           rule, scenario, step]                            │
     │                                                                            │              │
│    │                                                                            │
     └────────────────────────────────────────────────────────────────────────────┘              │
│          ◈[explicit             ◈[implicit                    ◈[example table]
           │docstring             │docstring                    │                                │
│          │start]                │start]                       │
           │                      │                             │                                │
│          ▼                      ▼                             ▽
     ╔═══════════════════════════════════╗    ╔═══════════════════════════════════╗              │
│    ║                                   ║    ║                                   ║
     ║         Capture Docstring         ║    ║       Capture Example Table       ║              │
│    ║                                   ║    ║                                   ║
     ╚═══════════════════════════════════╝    ╚═══════════════════════════════════╝              │
│          │[explicit             │[implicit                    │[annotation, blank line, block
           │docstring             │docstring                     comment delimiter, end, rule,   │
│          │end]                  │end]                         │scenario, single line comment]
           ▽                      ●                              ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
│    ┌───────────────────────────────────┐
     │      End Scenario Docstring       │
│    │                                   │
     │  [annotation, blank line, block   │
│    │  comment, rule, scenario, single  │
     │        line comment, step]        │
│    └───────────────────────────────────┘
                       │[annotation, blank line, block
│                       comment, rule, scenario, single
                       │line comment, step]
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
</pre>

### Capture Docstring

<pre>
                      ◈                                                  ◈
                      │[explicit docstring start]                        │[implicit docstring start]
                      │                                                  │
                      │                                                  │
                      ▽                                                  │
┌───────────────────────────────────────────┐                            │
│                                           │                            │
│         Begin Explicit Docstring          │                            │
│                                           │                            │
│                  [text]                   │                            │
│                                           │                            │
└───────────────────────────────────────────┘                            │
                      │[text]                                            │
                      │                                                  │
                      │                                                  │
                      ▼                                                  ●
┌───────────────────────────────────────────┐      ┌───────────────────────────────────────────┐
│        Capture Explicit Docstring         │      │        Capture Implicit Docstring         │
│                                           │      │                                           │
│  [annotation, blank line, block comment   │      │  [annotation, blank line, block comment   │
│   delimiter, single line comment, rule,   │      │   delimiter, single line comment, rule,   │
│              scenario, step]              │      │              scenario, step]              │
│                                           │      │                                           │
└───────────────────────────────────────────┘      └───────────────────────────────────────────┘
                      │[explicit docstring end]                          │[implicit docstring end]
                      │                                                  │
                      │                                                  │
                      ▽                                                  ●
</pre>

### Capture Example Table

<pre>
▲                         ◈
                          │[example table]
│                         │
                          │
│                         ▽
    ┌───────────────────────────────────────────┐
│   │                                           │
    │           Declare Example Table           │
│   │                                           │
    │        [example table header row]         │
│   │                                           │
    └───────────────────────────────────────────┘
│                         │[example table header row]
                          │
│                         │
                          ▽
│   ┌───────────────────────────────────────────┐
    │                                           │
│   │       Capture Example Table Header        │
    │                                           │
│   │       [example table separator row]       │
    │                                           │
│   └───────────────────────────────────────────┘
                          │[explicit table separator row]
│                         │
                          │
│                         ▽
    ┌───────────────────────────────────────────┐
│   │                                           │
    │    Consume Example Table Separator Row    │
│   │                                           │
    │         [example table data row]          │
│   │                                           │
    └───────────────────────────────────────────┘
│                         │[example table data row]
                          │
│                         │
                          ▽
│   ┌───────────────────────────────────────────┐
    │        Capture Example Table Data         │
│   │                                           │
    │  [annotation, blank line, block comment   │
│   │  delimiter, example table data row, end,  │
    │   rule, scenario, single line comment]    │
│   │                                           │
    └───────────────────────────────────────────┘
│                         │[annotation, blank line, block
                           comment delimiter, end, rule,
│                         │scenario, single line comment]
 ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
</pre>

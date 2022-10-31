1. What happens to comments in docstrings?
1. Docstring being unindented immediately - error or not?
1. Docstrings being terminated immediately - error or not?
1. Consider dispatching events to state.on(session, event) method, and having this delegate to specific onSomeEvent handlers
1. Rename onBlockComment => onBlockCommentDelimiter
1. Consider renaming tests from 'An annotation' => 'Annotations'
1. Consider moving featureBuilder code into onEnter() method of event handler, e.g.
   ```
   onEnter(session, event) {
    this._featureBuilder.createBackground({ ...event.data });
   }
   ```
1. Remove toPreviousState
1. Sync FeatureBuilder and state transition naming, e.g. featureBuilder.createFeature => featureBuilder.declareFeature
1. Find out why ExampleTableHeaderRowEvent stashes the headings in the session
1. Session should not have to check hasOwnProperty('indentation')
1. the end of an indented docstring => the end of an implicit docstring
1. Decide docstring docString DocString case
1. Do we remove indentation from steps
1. Do we need DocStringTextEvent or will a regular TextEvent do? (maybe, depends on whether we remove indentation from steps)
1. Delete unused featurebuilder methods
1. Check for annotations: [] in featureBuilder calls
1. Shoudl feature builder be more explicit about appending or creating things like steps and docstrings?
1. Rather than update the session, should events record things like token and indentation in the context?

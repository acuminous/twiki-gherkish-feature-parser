1. What happens to comments in docstrings?
1. Docstring being unindented immediately - error or not?
1. Docstrings being terminated immediately - error or not?
1. Make the featureBuilder stash annotations rather than the states
1. Consider dispatching events to state.on(session, event) method, and having this delegate to specific onSomeEvent handlers
1. Rename onBlockComment => onBlockCommentDelimiter
1. Consider renaming tests from 'An annotation' => 'Annotations'
1. Consider moving featureBuilder code into onEnter() method of event handler, e.g.
   ```
   onEnter(session, event) {
    this._featureBuilder.createBackground({ ...event.data });
   }
   ```
1. Remote toPreviousState

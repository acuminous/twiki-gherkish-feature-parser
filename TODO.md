1. Find out why ExampleTableHeaderRowEvent stashes the headings in the session
1. Session should not have to check hasOwnProperty('indentation')
1. Do we need DocstringTextEvent or will a regular TextEvent do? (maybe, depends on whether we remove indentation from steps)
1. Should feature builder be more explicit about appending or creating things like steps and docstrings?
1. Rather than update the session, should events record things like token and indentation in the context?
1. Add ExampleTable events to each states anticipated events list
1. What happens if annotations are stashed, then the next element doesn't suppor them (e.g. an example table)
   - I need to have an AnnotationState which will not support example table, i.e.
     @foo=bar
     Where:
1. Explicit session management functions for docstrings
1. Do not expose state name from machine

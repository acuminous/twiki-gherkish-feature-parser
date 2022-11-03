1. Find out why ExampleTableHeaderRowEvent stashes the headings in the session
1. Should feature builder be more explicit about appending or creating things like steps and docstrings?
1. Add ExampleTable events to each states anticipated events list
1. What happens if annotations are stashed, then the next element doesn't suppor them (e.g. an example table)
   - I need to have an AnnotationState which will not support example table, i.e.
     @foo=bar
     Where:

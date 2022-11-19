1. Should feature builder be more explicit about appending or creating things like steps and docstrings?
1. Add ExampleTable events to each states anticipated events list
1. Stop StateMachineTestBuilder using machine.\_currentState (maybe make ".state" return the actual state rather than name
1. Reporting unexpected events from CaptureAnnotationState is too generic - the expected events are dependent on the previous state
1. this.\_match(source, session) doesn't take a session
1. Delimit example tables
1. Check events for consistency of \_getData(match) vs \_getDelimiter(source, session) etc
1. Use shouldUnwind and shouldDispatch consistently
1. Make Event description static so it can be accessed without instanticating from StateMachineTestBuilder

1. Stop StateMachineTestBuilder using machine.\_currentState (maybe make ".state" return the actual state rather than name
1. Reporting unexpected events from CaptureAnnotationState is too generic - the expected events are dependent on the previous state
1. Delimit example tables
1. Use shouldUnwind and shouldDispatch consistently
1. Make Event description static so it can be accessed without instanticating from StateMachineTestBuilder

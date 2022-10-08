@only
@library=Buck Rogers Common
@library=Buck Rogers Season One
Feature: Buck Rogers - Season One

Buck Rogers season one comprising of 24 episodes.
It was first aired on September 20th, 1979.

@timeout=5000
Background: Introduction
  Given the year is 1987
  And NASA launches the last of America's deep space probes
  @skip
  When a freak mishap occurs
  Then Buck Rogers is blown out of his trajectory into an orbit which freezes his life support systems
  And returns Buck Rogers to Earth 500 years later

@skip
Scenario: Awakening

  Given the Draconians have planted a homing beacon aboard Buck's shuttle
  When Buck arrives on Earth
  Then he must adjust to the 25th century
  And convince the Earth Defense Directorate that the Draconians are secretly planning to conquer them

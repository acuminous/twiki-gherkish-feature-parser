@genre=Sci-Fi
Feature: Buck Rogers - Season One

Background: Introduction

  In the year 1987, NASA launched the last of its deep space probes, commanded by Captain William “Buck” Rogers
  During the mission, Buck suddenly encountered strange forces that resulted in his ship being thrown off course and his body being perfectly frozen in suspended animation

@network=NBC
Rule: Season 1

  Buck Rogers season one comprising of 24 episodes

  @aired=1979-09-20
  Background: Awakening

    When defense forces intercept Buck on his way to Earth
    Then he learns of his strange fate
    And is suspected of being a spy.

  @aired=1979-09-27
  Scenario: Planet of the Slave Girls

    When Buck and Wilma go to a farm world
    And investigate poisoning of Earth's food
    Then they find a slave trade.

@network=NBC
Rule: Season 2

  Buck Rogers season two comprising of 13 episodes

  @aired=1981-01-15
  Background: Time of the Hawk

    Given marauding space pirates have murdered Hawk's people
    Then he swears revenge on the human race
    When buck captures the birdman Hawk's mate
    Hawk is lured him out of hiding
    And forced to fight in open space

  @aired=1981-01-22
  Scenario: Journey to Oasis

    Given Wilma, an alien ambassador, Buck, Hawk and Dr. Goodfellow are flying to a peace conference on planet R-4
    When the ${primary transport} crashes
    Then they reach the meeting by ${alternative transport}
    And avert a war

  Where:

    | primary transport | alternative transport |
    |-------------------|-----------------------|
    | shuttle           | foot                  |
    | shuttle           | rover                 |
    | fighter           | jetpac                |
    | fighter           | hover\|board          |

Feature: Buck Rogers - Season One

  Scenario: Journey to Oasis

    Given Wilma, an alien ambassador, Buck, Hawk and Dr. Goodfellow are flying to a peace conference on planet R-4
    When the ${primary transport} crashes
    Then they reach the meeting by ${alternative transport}
    And avert a war

    Where:

      | primary transport | alternative transport |
      |-------------------|-----------------------|
      | shuttle           |

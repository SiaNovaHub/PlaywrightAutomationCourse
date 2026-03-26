Feature: Error validations

    @Validation
    Scenario Outline: Submit the wrong password
        Given I login to Ecomm app with "<email>" and "<password>"
        Then I see login error message

        Examples:
            | email                 | password |
            | stacygrreen@gmail.com | AAA      |
            | stacygrreen@gmail.com | BBB      |
            | stacygrreen@gmail.com | CCC      |

    @Validation
    Scenario: Submit the wrong email
        Given I login to Ecomm app with "emial@gmail.com" and "Xj2#hf3nD"
        Then I see login error message
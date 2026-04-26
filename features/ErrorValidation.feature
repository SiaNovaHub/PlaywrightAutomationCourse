Feature: Login validation

    @Validation @Login
    Scenario Outline: Submit an invalid password
        Given I login to Ecomm app with "<email>" and "<password>"
        Then I see login error message

        Examples:
            | email                 | password |
            | stacygrreen@gmail.com | AAA      |
            | stacygrreen@gmail.com | BBB      |
            | stacygrreen@gmail.com | CCC      |

    @Validation @Login
    Scenario: Submit an invalid email
        Given I login to Ecomm app with "emial@gmail.com" and "Xj2#hf3nD"
        Then I see login error message
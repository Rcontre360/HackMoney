Currently assumes 2 variables, "number of POAPs" and "months since last POAP", with coefficients of
25 and -1, along with an intercept of 350. In other words, the dummy equation can be written as:
`chain_score = 350 + 25 * number_of_poaps - months_since_last_poap`


To start the app: `python3 app.py`
To test, visit http://localhost:9999 in your browser
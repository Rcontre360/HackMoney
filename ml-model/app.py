from flask import Flask, render_template, request
import numpy as np
import pickle
import helpers

app = Flask('chainscore-ml-model')

@app.route('/')
def show_predict_stock_form():
    return render_template('predictorform.html')

@app.route('/results', methods=['POST'])
def results():
    form = request.form
    if request.method == 'POST':
      #write your function that loads the model
      model = pickle.load(open('chainscore-ml-model.sav', 'rb'))
      num_poaps = request.form['num_poaps']
      days_since_last_poap = request.form['days_since_last_poap']
      model_inputs = np.array([num_poaps, days_since_last_poap]).reshape(1,-1)
      poap_credit_score = model.predict(model_inputs)
      return render_template('resultsform.html', num_poaps=num_poaps, days_since_last_poap=days_since_last_poap, poap_credit_score=poap_credit_score)


@app.route('/chainscore', methods=['GET'])
def chainscore():
    args = request.args
    wallet_address = args.get('wallet_address')
    loan_term_in_months = args.get('loan_term_in_months', type=int)
    loan_amount = args.get('loan_amount', type=int)
    poap_def_prob = helpers.get_poap_def_prob(wallet_address)
    term_def_prob = helpers.get_term_def_prob(loan_term_in_months)
    loan_amount_def_prob = helpers.get_loan_amount_def_prob(loan_amount)

    chainscore_def_prob = round(max(0, min(1, poap_def_prob + term_def_prob + loan_amount_def_prob)), 4)
    return 'ChainScore default probability: ' + str(chainscore_def_prob)



app.run("localhost", "9999", debug=True)

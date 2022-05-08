from flask import Flask, render_template, request
import numpy as np
import pickle

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
      months_since_last_poap = request.form['months_since_last_poap']
      model_inputs = np.array([num_poaps, months_since_last_poap]).reshape(1,-1)
      poap_credit_score = model.predict(model_inputs)
      return render_template('resultsform.html', num_poaps=num_poaps, months_since_last_poap=months_since_last_poap, poap_credit_score=poap_credit_score)


app.run("localhost", "9999", debug=True)

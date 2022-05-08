import numpy as np
import pickle
from sklearn import datasets, linear_model

lr = linear_model.LinearRegression()

# Arbitrary placeholder values for now
lr.intercept_ = 350
lr.coef_ = np.array([25,-1])

# Test that it works
lr.predict(np.array([2,10]).reshape(1, -1))

pickle.dump(lr, open('chainscore-ml-model.sav', 'wb'))

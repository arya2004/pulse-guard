

import warnings 
warnings.filterwarnings('ignore')

import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
import pickle

# Load the datasheet from Kaggle
stroke = pd.read_csv('healthcare-dataset-stroke-data.csv')

stroke['age'] = stroke['age'].apply(lambda x : round(x))

# BMI to NaN
stroke['bmi'] = stroke['bmi'].apply(lambda bmi_value: bmi_value if 12 < bmi_value < 60 else np.nan)

# Sorting DataFrame based on Gender then on Age and using Forward Fill-ffill() to fill NaN value for BMI
stroke.sort_values(['gender', 'age'], inplace=True) 
stroke.reset_index(drop=True, inplace=True)
stroke['bmi'].ffill(inplace=True)

#Converting Categorical Data to Numerical
gender_dict = {'Male': 0, 'Female': 1, 'Other': 2}
ever_married_dict = {'No': 0, 'Yes': 1}
work_type_dict = {'children': 0, 'Never_worked': 1, 'Govt_job': 2, 'Private': 3, 'Self-employed': 4}
residence_type_dict = {'Rural': 0, 'Urban': 1}
smoking_status_dict = {'Unknown': 0, 'never smoked': 1, 'formerly smoked':2, 'smokes': 3}

stroke['gender'] = stroke['gender'].map(gender_dict)
stroke['ever_married'] = stroke['ever_married'].map(ever_married_dict)
stroke['work_type'] = stroke['work_type'].map(work_type_dict)
stroke['Residence_type'] = stroke['Residence_type'].map(residence_type_dict)
stroke['smoking_status'] = stroke['smoking_status'].map(smoking_status_dict)

X = stroke.drop(columns=['id', 'stroke'])
y = stroke['stroke']

# Create a new dataframe with the required parameters
features = stroke[["age", "gender", "hypertension", "heart_disease", "ever_married", "work_type", "Residence_type", "avg_glucose_level", "bmi", "smoking_status"]]

# Create a target variable
target = stroke["stroke"]

# Train a logistic regression model
model = LogisticRegression()
model.fit(features, target)

# Predict the stroke probability for the given parameters
#probability = model.predict_proba([[age, gender, hypertension, heart_disease, ever_married, work_type, Residence_type, avg_glucose_level, bmi, smoking_status]])[0][1]
filename = 'lwl.pkl'
pickle.dump(model, open(filename, 'wb'))
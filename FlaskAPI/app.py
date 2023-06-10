from flask import Flask, render_template, request
import numpy as np
import pickle


app = Flask(__name__)
model = pickle.load(open('Stroke.pkl', 'rb'))
yui = pickle.load(open('lwl.pkl', 'rb'))






@app.route("/lul", methods=['POST'])
def lel():

    age = int(request.json['age'])
    hypertension = int(request.json['hypertension'])
    heart_disease = int(request.json['heart_disease'])
    ever_married = int(request.json['ever_married'])
    work_type = int(request.json['work_type'])
    Residence_type = int(request.json['Residence_type'])
    avg_glucose_level = float(request.json['avg_glucose_level'])
    bmi = int(request.json['bmi'])
    gender = int(request.json['gender'])
    smoking_status = int(request.json['smoking_status'])
    
#features = stroke[["age", "gender", "hypertension", "heart_disease", "ever_married", "work_type", "Residence_type", "avg_glucose_level", "bmi", "smoking_status"]]

    probability = yui.predict_proba([[age, gender, hypertension, heart_disease, ever_married, work_type, Residence_type, avg_glucose_level, bmi, smoking_status]])[0][1]
    print(probability)

    return str(probability)



if __name__ == "__main__":
    app.run(debug=True)


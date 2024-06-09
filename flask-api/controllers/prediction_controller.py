from flask import request, jsonify
from utils.load_models import get_models

def predict_stroke():
    model, yui = get_models()
    
    data = request.json
    age = int(data['age'])
    hypertension = int(data['hypertension'])
    heart_disease = int(data['heart_disease'])
    ever_married = int(data['ever_married'])
    work_type = int(data['work_type'])
    Residence_type = int(data['Residence_type'])
    avg_glucose_level = float(data['avg_glucose_level'])
    bmi = int(data['bmi'])
    gender = int(data['gender'])
    smoking_status = int(data['smoking_status'])

    features = [[age, gender, hypertension, heart_disease, ever_married, work_type, Residence_type, avg_glucose_level, bmi, smoking_status]]
    probability = yui.predict_proba(features)[0][1]
    print(probability)

    return jsonify({'probability': probability})

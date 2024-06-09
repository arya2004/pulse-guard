import pickle

def get_models():
    model = pickle.load(open('models/stroke_model.pkl', 'rb'))
    yui = pickle.load(open('models/lwl_model.pkl', 'rb'))
    return model, yui

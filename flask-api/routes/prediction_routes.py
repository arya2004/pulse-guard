from flask import Blueprint
from controllers.prediction_controller import predict_stroke

prediction_bp = Blueprint('prediction', __name__)

@prediction_bp.route("/lul", methods=['POST'])
def lel():
    return predict_stroke()

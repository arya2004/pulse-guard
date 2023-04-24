const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PulseSchema = new Schema({
    calculated_at: Date,
    pulse: Number,
    patient:{
            type: Schema.Types.ObjectId,
            ref:'Patient',
        },

},
)



module.exports = mongoose.model('Pulse', PulseSchema)
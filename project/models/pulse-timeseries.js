const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PulseSchema = new Schema({
    calculated_at: Date,
    pulse: Number,
    metadata:{
        patient:{
            type: Schema.Types.ObjectId,
            ref:'Patient',
        },
    },

},{
    timeseries:{
        timeField: 'calculated_at',
        metaField: 'metadata',
        granularity: 'seconds',

        },
    expireAfterSeconds:30,
    },
)



module.exports = mongoose.model('Pulse', PulseSchema)
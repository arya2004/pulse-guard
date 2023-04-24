const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const plm = require('passport-local-mongoose')
const Pulse = require('./pulse')
const PulseArchieve = require('./pulse_archive')


const PatientSchema = new Schema({
    name: String,
    email:{
        type: String,
        required: true,
        unique: true
    },
    age:{
        type: Number,//
        required: true,
    },

    sex:{
        type:String,//
        required: true,
        enum: ['M','F']
    },
    chestpaintype:{
        type:String,
        required:true,//
        enum:['TA','ATA','NAP', 'ASY']
    },
    restingbloodpressure:{
        type:Number,//
        required:true
    },
    cholestrol:{
        type:Number,//
        required:true
    },
    fastingbloodsugar:{
        type: Boolean,//
        required:true
    },
    resting_ecg:{
        type:String,
        required:true,//
        enum:['Normal','ST','LVH']
    },
    max_hr:{
        type:Number,//
        required:true,
    },
    exerciseangia:{
        type: String,
        required:true,//
        enum:['Y','N']
    },
    oldpeak:{
        type:Number,
        required:true,//
    },
    st_slope:{
        type:String,
        required:true,//
        enum:['Up','Down','Flat']
    },
    heart_disease:{
        type:Boolean,
        required:true//
    },
    isDoctor:{
        type:Boolean,
        default: false
       
    },
    pulse:[{
        type: Schema.Types.ObjectId,
        ref: 'Pulse'
    }],
    pulseArchieve:[{
        type: Schema.Types.ObjectId,
        ref: 'PulseArchieve'
    }]
})

PatientSchema.plugin(plm);

module.exports = mongoose.model('Patient', PatientSchema)
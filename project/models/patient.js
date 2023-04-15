const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const plm = require('passport-local-mongoose')
const Pulse = require('./pulse')


const PatientSchema = new Schema({
    name: String,
    email:{
        type: String,
        required: true,
        unique: true
    },
    age:{
        type: Number,
        required: true,
    },
    Level_of_Hemoglobin:{
        type: Number,
        required: true
    },
    Genetic_Pedigree_Coefficient:{
        type:Boolean,
        required: true
    },
    BMI:{
        type:Number,
        required: true
    },
    Sex:{
        type:Boolean,
        required: true
    },
    Pregnancy:{
        type:Boolean,
        required: true
    },
    Smoking:{
        type:Boolean,
        required: true
    },
    pulse:[{
        type: Schema.Types.ObjectId,
        ref: 'Pulse'
    }]
})

PatientSchema.plugin(plm);

module.exports = mongoose.model('Patient', PatientSchema)
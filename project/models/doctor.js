const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const plm = require('passport-local-mongoose')
const Pulse = require('./pulse')


const DoctorSchema = new Schema({
    name: String,
    email:{
        type: String,
        required: true,
        unique: true
    },
    isDoctor:{
        type:Boolean,
        default:true,
        required:true
    }
})

DoctorSchema.plugin(plm);

module.exports = mongoose.model('Doctor', DoctorSchema)
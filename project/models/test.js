const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const plm = require('passport-local-mongoose')
const Pulse = require('./pulse')


const TestSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    
    pulse:[{
        type: Schema.Types.ObjectId,
        ref: 'Pulse'
    }]
    
})

TestSchema.plugin(plm);

module.exports = mongoose.model('Test', TestSchema)
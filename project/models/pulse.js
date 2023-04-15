const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PulseSchema = new Schema({
    camculated_at: Date,

})



module.exports = mongoose.model('Pulse', PulseSchema)
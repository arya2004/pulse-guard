const Pulse = require('../models/pulse');
const PulseTimeseries = require('../models/pulse-timeseries');
const PulseArchieve = require('../models/pulse_archive');
const Patient = require('../models/patient');
const axios = require('axios');

module.exports.getPulseData = async (req, res) => {
    try {
        const { id } = req.params;
        let pulse = await Pulse.find({ patient: id }).sort({ _id: -1 }).limit(1);
        res.send(pulse[0].pulse.toString());
    } catch (error) {
        console.log(error);
    }
};

module.exports.renderPulseArchive = async (req, res) => {
    try {
        const archive = await Patient.find({ isDoctor: false }).populate('pulseArchieve');
        res.render('t.ejs', { archive });
    } catch (error) {
        console.log(error);
    }
};

module.exports.createPulseData = async (req, res) => {
    const { id } = req.params;
    let items = await Pulse.find({ patient: id }).sort({ _id: -1 }).limit(10);
    const array = items.map(item => item.pulse);
    const test = await Patient.findById(id);
    const rate = req.body.pulse;
    const pulse = new Pulse();
    const pulsets = new PulseTimeseries();
    const date = new Date();
    pulse.calculated_at = date.getTime();
    pulse.pulse = req.body.pulse;
    pulse.patient = id;
    pulse.rate = req.body.pulse;
    pulsets.calculated_at = date.getTime();
    pulsets.pulse = req.body.pulse;
    pulsets.patient = id;
    pulsets.rate = req.body.pulse;
    pulsets.save();
    pulse.save();
    test.pulse.push(pulse);
    test.pulsetimeseries.push(pulsets);
    let mean = array.reduce((acc, curr) => acc + curr, 0) / array.length;
    if (mean > 100) {
        const tachycardia = new PulseArchieve();
        tachycardia.calculated_at = date.getTime();
        tachycardia.pulse = mean;
        tachycardia.patient = id;
        test.pulseArchieve.push(tachycardia);
        await tachycardia.save();
        await test.save();
        return res.sendStatus(201);
    }
    if (mean < 40) {
        const bradycardia = new PulseArchieve();
        bradycardia.calculated_at = date.getTime();
        bradycardia.pulse = mean;
        bradycardia.patient = id;
        test.pulseArchieve.push(bradycardia);
        await bradycardia.save();
        await test.save();
        return res.sendStatus(202);
    }
    await test.save();
    res.sendStatus(200);
};

module.exports.strokePrediction = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.send("not authenticated");
    }
    try {
        const requestBody = {
            age: req.body.age.toString(),
            hypertension: req.body.hypertension.toString(),
            heart_disease: req.body.heart_disease.toString(),
            ever_married: req.body.ever_married.toString(),
            work_type: req.body.work_type.toString(),
            Residence_type: req.body.Residence_type.toString(),
            avg_glucose_level: req.body.avg_glucose_level.toString(),
            bmi: req.body.bmi.toString(),
            gender: req.body.gender.toString(),
            smoking_status: req.body.smoking_status.toString()
        };
        const response = await axios.post('http://127.0.0.1:5000/lul', requestBody);
        res.render('info.ejs', { dataa: response.data.toString() });
    } catch (error) {
        console.log(error);
    }
};

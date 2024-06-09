const Patient = require('../models/patient');
const Pulse = require('../models/pulse');
const PulseTimeseries = require('../models/pulse-timeseries');
const PulseArchieve = require('../models/pulse_archive');
const axios = require('axios');

module.exports.showPatientDashboard = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.send("not authenticated");
    }
    try {
        const { id } = req.params;
        const patient = await Patient.findById(id).populate('pulse').populate('pulseArchieve');
        if (!patient._id.equals(req.user._id)) {
            return res.send("not owner");
        }
        res.render('dashboard.ejs', { patient });
    } catch (error) {
        console.log(error);
    }
};

module.exports.createPatient = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const patient = new Patient(req.body);
        const registeredPatient = await Patient.register(patient, password);
        console.log(registeredPatient);
        res.redirect('/');
    } catch (e) {
        console.log(e);
        res.redirect('/');
    }
};

const express = require('express');
const router = express.Router();
const pulseController = require('../controllers/pulseController');
const { isLoggedin, isPatient, isDoctor } = require('../middleware/authMiddleware');

router.get('/2/:id', isLoggedin, isPatient, pulseController.getPulseData);
router.get('/4', isLoggedin, isDoctor, pulseController.renderPulseArchive);
router.post('/:id/esp32', pulseController.createPulseData);
router.post('/stroke', pulseController.strokePrediction);

module.exports = router;

const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/', homeController.renderHome);
router.get('/team', homeController.renderTeam);
router.get('/new', homeController.renderNew);
router.get('/prediction', homeController.renderPrediction);

module.exports = router;

const express = require('express');
const router = express.Router();
const leftoverController = require('../controllers/leftoverController');

router.get('/options', leftoverController.getLeftoverOptions);
router.post('/match', leftoverController.matchLeftover);

module.exports = router;

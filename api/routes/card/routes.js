const router = require('express').Router();

//Card Handler
router.get('/cards', require('./checkCardsHandler'));
router.delete('/cards/dismantle', require('./deleteCardsHandler'));

module.exports = router;
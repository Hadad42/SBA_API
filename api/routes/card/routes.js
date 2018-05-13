const router = require('express').Router();

//Card Handler
router.get('/', require('./checkCardsHandler'));
router.delete('/dismantle', require('./deleteCardsHandler'));

module.exports = router;
const router = require('express').Router();

/*
** Route /booster handler
*/

router.post('/buy', require('./buyBoosterHandler'));

module.exports = router;
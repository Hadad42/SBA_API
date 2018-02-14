const router = require('express').Router();

/*
** Route /booster handler
*/

app.post('/buy', require('./buyBoosterHandler'));

module.exports = router;
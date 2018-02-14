const router = require('express').Router();

/*
** Route /booster handler
*/

app.post('/buy', require('./api/routes/booster/buyBoosterHandler'));

module.exports = router;
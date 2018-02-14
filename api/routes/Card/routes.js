const router = require('express').Router();

//Card Handler
app.get('/cards', require('./checkCardsHandler'));
app.delete('/cards/dismantle', require('./deleteCardsHandler'));

module.exports = router;
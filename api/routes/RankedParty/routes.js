const router = require('express').Router();

/*
** Route /rankedParty handler
*/

app.put('/win', require('./win'));
app.put('/equality', require('./equality'));
app.put('/defeat', require('./defeat'));

module.exports = router;
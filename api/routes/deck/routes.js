const router = require('express').Router();

/*
** route /deck Handler
*/

app.get('/', require('./checkDeckHandler'));
app.post('/create', require('./createDeckHandler'));
app.put('/:id/update', require('./modifyDeckHandler'));

module.exports = router;
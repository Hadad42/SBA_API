const router = require('express').Router();

/*
** Route /user handler
*/

app.get('/getAll', require('./getAll'));
app.get('/getById', require('./getById'));
app.delete('/delete', require('./delete'));
app.put('/update', require('./update'));

module.exports = router;
const router = require('express').Router();

/*
** Route /article handler
*/

app.put('/create', require('./create'));
app.get('/getAll', require('./getAll'));
app.get('/:article_id', require('./getById'));
app.delete('/delete', require('./delete'));
app.put('/update', require('./update'));

module.exports = router;
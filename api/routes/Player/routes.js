const router = require('express').Router();

/*
** Route /player handler
*/

app.get('/getInformation', require('./playerHandler'));
app.get('/getRank', require('./getRank'));
app.put('/addPart', require('./addPart'));
app.put('/addGold', require('./addGold'));
app.put('/updateMail', require('./updateMail'));
app.put('/updateName', require('./updateName'));
app.put('/updatePassword', require('./updatePassword'));

module.exports = router;
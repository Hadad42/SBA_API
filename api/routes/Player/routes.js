const router = require('express').Router();

/*
** Route /player handler
*/

router.get('/getInformation', require('./playerHandler'));
router.get('/getRank', require('./getRank'));
router.put('/addPart', require('./addPart'));
router.put('/addGold', require('./addGold'));
router.put('/updateMail', require('./updateMail'));
router.put('/updateName', require('./updateName'));
router.put('/updatePassword', require('./updatePassword'));

module.exports = router;
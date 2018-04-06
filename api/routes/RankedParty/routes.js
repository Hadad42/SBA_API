const router = require('express').Router();

/*
** Route /rankedParty handler
*/

router.put('/win', require('./win'));
router.put('/equality', require('./equality'));
router.put('/defeat', require('./defeat'));

module.exports = router;
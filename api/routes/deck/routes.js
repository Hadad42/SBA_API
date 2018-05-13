const router = require('express').Router();

/*
** route /deck Handler
*/

router.get('/', require('./checkDeckHandler'));
router.post('/create', require('./createDeckHandler'));
router.put('/:id/update', require('./modifyDeckHandler'));

module.exports = router;
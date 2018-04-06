const router = require('express').Router();

/*
** Route /user handler
*/

router.get('/getAll', require('./getAll'));
router.get('/getById', require('./getById'));
router.delete('/delete', require('./delete'));
router.put('/update', require('./update'));

module.exports = router;
const router = require('express').Router();

/*
** Route /article handler
*/

router.put('/create', require('./create'));
router.get('/getAll', require('./getAll'));
router.get('/:article_id', require('./getById'));
router.delete('/delete', require('./delete'));
router.put('/update', require('./update'));

module.exports = router;
var express = require('express');
var router = express.Router();
var jwt_handler = require('../controllers/check_jwt');
router.use(jwt_handler);

router.get('/card', function (req, res, next) {
    var ID = req.body.id;
    var ret = {
        "status": "200",
        "cards": []
    };
    res.json(ret);
    var sql = "SELECT * FROM card WHERE Id='"+ID+"'";
    var query = db.query(sql, function (err, results) {
        if (err){
            throw err;
        }
        else {
            if (results !== ""){
                ret.cards = results;

            }
        }
    });
    res.end()
});

module.exports = router;

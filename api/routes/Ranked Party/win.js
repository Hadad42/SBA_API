var express = require('express');
var router = express.Router();
var jwt_handler = require('../../controllers/check_jwt');

router.use(jwt_handler);

router.post("/rankedPartyWin", function (req, res, next) {
    var id = req.decoded_data.Id;

    var sql_data = 'UPDATE rank \
    SET rank.Victory = rank.Victory + "' + 1 + '" \
    WHERE rank.User_id = "' + id + '"';

    var query = db.query(sql_data, function (err, result) {
        if (err) {
            throw err;
        }
        l = result.length;
        if (l === 0) {
            return res.status(403).send(JSON.parse('{ "message": "User does not exist"} '));
        }
        else {
            res.json({
                "results":
                    {
                        "status": true
                    }
            });
            res.end();
        }
    });
});

module.exports = router;
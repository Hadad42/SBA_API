var express = require('express');
var router = express.Router();
var jwt_handler = require('../../controllers/check_jwt');

router.use(jwt_handler);

router.post("/addDust", function (req, res, next) {
    var player_id = req.decoded_data.Id;
    var dust = req.body.dust;

    var sql_data = 'UPDATE player \
    SET player.Dust = player.Dust + "' + dust + '" \
    WHERE player.ID = "' + player_id + '"';

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
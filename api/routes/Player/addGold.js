var express = require('express');
var router = express.Router();
var jwt_handler = require('../../controllers/check_jwt');

router.use(jwt_handler);

router.post("/addGold", function (req, res, next) {
    var player_id = req.decoded_data.Id;
    var gold = req.body.gold;

    var sql_data = 'UPDATE player \
    SET player.Gold = player.Gold + "' + gold + '" \
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
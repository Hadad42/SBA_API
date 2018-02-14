var express = require('express');
var router = express.Router();
var jwt_handler = require('../../controllers/check_jwt');

router.use(jwt_handler);

router.put("/player/addGold", function (req, res, next) {
    var player_id = req.decoded_data.Id;
    var gold = req.body.gold;

    if (!req.body.gold || isNaN(req.body.gold) === true) {
        res.status(422).send({"results": {"status": 422, "error": "Parameter gold is incorrect or missing"}});
    }
    else {
        var sql_data = 'UPDATE player \
    SET player.Gold = player.Gold + "' + gold + '" \
    WHERE player.ID = "' + player_id + '"';
        var query = db.query(sql_data, function (err, result) {
            if (err) {
                throw err;
            }
            l = result.length;
            if (l === 0) {
                res.json({
                    "results":
                        {
                            "status": 403,
                            "message": 'User does not exist'
                        }
                });
                res.end();
            }
            else {
                res.json({
                    "results":
                        {
                            "status": 200,
                            "message": 'The amount of gold has been changed successfully'
                        }
                });
                res.end();
            }
        });
    }
});

module.exports = router;
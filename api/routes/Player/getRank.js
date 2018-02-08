var express = require('express');
var router = express.Router();
var jwt_handler = require('../../controllers/check_jwt');

router.use(jwt_handler);

router.get("/getRank", function (req, res, next) {
    var player_id = req.decoded_data.Id;

    var sql_data = "SELECT rank.Victory, rank.Equality, rank.Defeat\
    FROM rank \
    WHERE rank.User_id = " + player_id + "";

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
                        "message" : 'User does not exist'
                    }
            });
            res.end();
        }
        else {
            res.json({
                "results":
                    {
                        "status": 200,
                        "data": result
                    }
            });
            res.end();
        }
    });
});

module.exports = router;
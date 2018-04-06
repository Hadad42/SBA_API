var express = require('express');
var router = express.Router();
var jwt_handler = require('../../controllers/check_jwt');

router.use(jwt_handler);

router.put("/equality", function (req, res, next) {
    var id = req.decoded_data.Id;

    var sql_data = 'UPDATE rank \
    SET rank.Equality = rank.Equality + "' + 1 + '" \
    WHERE rank.User_id = "' + id + '"';

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
                        "message" : 'Number of equality has been changed successfully'
                    }
            });
            res.end();
        }
    });
});

module.exports = router;
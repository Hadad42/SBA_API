var express = require('express');
var router = express.Router();

router.delete("/user/delete", function (req, res, next) {
    var user_id = req.body.id;

    if (!req.body.id || isNaN(req.body.id) === true) {
        res.status(422).send({"results": {"status": 422, "error": "Parameter id is incorrect or missing"}});
    }
    else {
        var sql_data = 'DELETE FROM user \
    WHERE user.id = "' + user_id + '"';

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
                            "message": 'An problem has occurred, try again later'
                        }
                });
                res.end();
            }
            else {
                res.json({
                    "results":
                        {
                            "status": 200,
                            "message": 'The account has been delete successfully'
                        }
                });
                res.end();
            }
        });
    }
});

module.exports = router;


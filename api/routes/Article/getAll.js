var express = require('express');
var router = express.Router();

router.get("/getAll", function (req, res, next) {

    var sql_data = "SELECT * \
    FROM article";

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
                        "message": 'An error as occurred, try again later'
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
var express = require('express');
var router = express.Router();

router.get("/article/getById", function (req, res, next) {

    var article_id = req.query.id;

    if (!req.query.id || isNaN(req.query.id) === true) {
        res.status(422).send({"results": {"status": 422, "error": "Query id is incorrect or missing"}});
    }
    else {
        var sql_data = 'SELECT *\
        FROM article\
        WHERE article.ID = "'+article_id+'"';

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
                            "data": result
                        }
                });
                res.end();
            }
        });
    }
});

module.exports = router;


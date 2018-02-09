var express = require('express');
var router = express.Router();

router.delete("/article/delete", function (req, res, next) {
    var article_id = req.body.id;
    var sql_data = 'DELETE FROM article \
    WHERE article.id = "' + article_id + '"';

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
                        "message" : 'An problem has occurred, try again later'
                    }
            });
            res.end();
        }
        else {
            res.json({
                "results":
                    {
                        "status": 200,
                        "message": 'The article has been delete successfully'
                    }
            });
            res.end();
        }
    });
});

module.exports = router;


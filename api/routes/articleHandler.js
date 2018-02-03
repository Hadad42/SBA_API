var express = require('express');
var router = express.Router();

router.get("/getArticle", function (req, res, next) {

    var sql_data = "SELECT article.Title, article.Description, article.Image, article.CreateDate, article.ModificationDate \
    FROM article";

    var query = db.query(sql_data, function (err, result) {
        if (err) {
            throw err;
        }
        l = result.length;
        if (l === 0) {
            return res.status(403).send(JSON.parse('{ "message": "An error as occurred, try again later"} '));
        }
        else {
            res.json({
                "results":
                    {
                        "status": true,
                        "data": result
                    }
            });
            res.end();
        }
    });
});

module.exports = router;
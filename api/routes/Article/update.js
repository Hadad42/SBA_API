var express = require('express');
var router = express.Router();

router.put("/article/update", function (req, res, next) {
    var article_id = rec.param;
    var title = req.body.title;
    var description = req.body.description;
    var image = req.body.image;
    var currentDate = new Date,
        dformat = [d.getFullYear(),
                d.getMonth()+1,
                d.getDate()].join('/')+' '+
            [d.getHours(),
                d.getMinutes(),
                d.getSeconds()].join(':');
    var sql_data = 'UPDATE article\
        SET article.Title = "' + title + '", article.Description = "'+description+'", article.Image = "'+ image +'", article.ModificationDate = "'+currentDate+ '" \
        WHERE article.ID = "' + article_id + '"';

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
                        "message" : 'An error as occurred, try again later'
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
var express = require('express');
var router = express.Router();

router.put("/article/update", function (req, res, next) {
    var article_id = req.query.id;
    var title = req.body.title;
    var description = req.body.description;
    var image = req.body.image;
    var currentDate = new Date,
        dformat = [currentDate.getFullYear(),
                currentDate.getMonth()+1,
                currentDate.getDate()].join('/')+' '+
            [currentDate.getHours(),
                currentDate.getMinutes(),
                currentDate.getSeconds()].join(':');
    console.log("article ID = "+ article_id);
    var sql_data = 'UPDATE article\
        SET article.Title = "' + title + '", article.Description = "'+description+'", article.Image = "'+ image +'", article.ModificationDate = "'+dformat+ '" \
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
                        "message" : 'The article has been changed successfully'
                    }
            });
            res.end();
        }
    });
});

module.exports = router;
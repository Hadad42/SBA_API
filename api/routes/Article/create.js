var express = require('express');
var router = express.Router();

router.post("/article/create", function (req, res, next) {
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
    var sql_data = "INSERT INTO article(`ID`,`Title`,`Description`,`Image`,`CreateDate`) \
        VALUES ('','" + title + "','" + description + "','" + image + "','"+currentDate+"')";

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
                        "message": 'The article have been successfully created'
                    }
            });
            res.end();
        }
    });
});

module.exports = router;
//rec.param ou rec.query
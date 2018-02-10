var express = require('express');
var router = express.Router();

//save image in uploads
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './articles/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
//filter file type
var fileFilter = function (req, file, cb) {
    if (file.mimetype)
    {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
        {
            cb(null, true);
        }
        else {
            cb(new Error('Type of the image is not supported'), false);
        }
    }
};
var upload = multer({
    storage: storage,
    limits:{
    fileSize: 1920*1080*5
    },
    fileFilter: fileFilter
});

router.post("/article/create", upload.single('articleImage'), function (req, res, next) {
    console.log("req.file = ", req.file);
    var title = req.body.title;
    var description = req.body.description;
    var image = req.body.image;
    var currentDate = new Date,
        dformat = [currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                currentDate.getDate()].join('/') + ' ' +
            [currentDate.getHours(),
                currentDate.getMinutes(),
                currentDate.getSeconds()].join(':');
    var sql_data = "INSERT INTO article(`ID`,`Title`,`Description`,`Image`,`Slug`,`CreateDate`) \
        VALUES ('','" + title + "','" + description + "','" + image + "','" + 'articles/'+req.file.originalname + "','" + dformat + "')";

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
                        "message": 'The article have been successfully created'
                    }
            });
            res.end();
        }
    });
});

module.exports = router;

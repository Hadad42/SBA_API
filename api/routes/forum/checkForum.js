var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    var select_query =
        'SELECT `ID`, `Author_id`, `Name`, `Creation_date`, `Tags` ' +
        'FROM `forum`;';
    var query = db.query(select_query, function (err, results) {
        if (err){
            throw err;
        }
        else {
            if (results !== ""){
                console.log(results);
                var ret = {
                    "status": "200",
                    "topics": []
                };
                ret.topics = results;
                res.json(ret);
                res.end()
            }
        }
    });
});

module.exports = router;
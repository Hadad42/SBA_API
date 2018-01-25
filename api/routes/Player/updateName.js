var express = require('express');
var router = express.Router();
var jwt_handler = require('../../controllers/check_jwt');

router.use(jwt_handler);

router.post("/updateName", function (req, res, next) {
    var user_id = req.decoded_data.Id;
    var oldName = req.body.oldName;
    var newName = req.body.newName;

    var sql_data = 'UPDATE user \
    SET user.Name = "' + newName + '" \
    WHERE user.ID = "' + user_id + '" AND user.Name = "' + oldName + '"';

    var query = db.query(sql_data, function (err, result) {
        if (err) {
            throw err;
        }
        l = result.length;
        if (l === 0 || result.affectedRows !== 1) {
            return res.status(403).send(JSON.parse('{ "message": "User does not exist"} '));
        }
        else {
            res.json({
                "results":
                    {
                        "status": true
                    }
            });
            res.end();
        }
    });
});


module.exports = router;
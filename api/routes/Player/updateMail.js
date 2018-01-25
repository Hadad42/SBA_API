var express = require('express');
var router = express.Router();
var jwt_handler = require('../../controllers/check_jwt');

router.use(jwt_handler);

router.post("/updateMail", function (req, res, next) {
    var user_id = req.decoded_data.Id;
    var oldMail = req.body.oldMail;
    var newMail = req.body.newMail;

    var sql_data = 'UPDATE user \
    SET user.Email = "' + newMail + '" \
    WHERE user.ID = "' + user_id + '" AND user.Email = "' + oldMail + '"';

    var query = db.query(sql_data, function (err, result) {
        if (err) {
            throw err;
        }
        console.log("result = ", result);
        var l = result.length;
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
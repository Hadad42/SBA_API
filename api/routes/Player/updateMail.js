var express = require('express');
var router = express.Router();
var jwt_handler = require('../../controllers/check_jwt');

router.use(jwt_handler);

router.put("/player/updateMail", function (req, res, next) {
    var user_id = req.decoded_data.Id;
    var oldMail = req.body.oldMail;
    var newMail = req.body.newMail;
    if (!req.body.oldMail) {
        res.status(422).send({"results": {"status": 422, "error": "Parameter oldMail is incorrect or missing"}});
    }
    else if (!req.body.newMail) {
        res.status(422).send({"results": {"status": 422, "error": "Parameter newMail is incorrect or missing"}});
    }
    else {
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
                res.json({
                    "results":
                        {
                            "status": 403,
                            "message": 'User does not exist'
                        }
                });
                res.end();
            }
            else {
                res.json({
                    "results":
                        {
                            "status": 200,
                            "message": 'Mail has been change successfully'
                        }
                });
                res.end();
            }
        });
    }
});


module.exports = router;
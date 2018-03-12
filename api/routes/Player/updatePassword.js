var express = require('express');
var router = express.Router();
var jwt_handler = require('../../controllers/check_jwt');

router.use(jwt_handler);

router.put("/updatePassword", function (req, res, next) {
    var user_id = req.decoded_data.Id;
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;


    if (!req.body.oldPassword) {
        res.status(422).send({"results": {"status": 422, "error": "Parameter oldPassword is incorrect or missing"}});
    }
    else if (!req.body.newPassword) {
        res.status(422).send({"results": {"status": 422, "error": "Parameter newPassword is incorrect or missing"}});
    }
    else {
        var sql_data = 'UPDATE user \
    SET user.Password = "' + newPassword + '" \
    WHERE user.ID = "' + user_id + '" AND user.Password = "' + oldPassword + '"';
        var query = db.query(sql_data, function (err, result) {
            if (err) {
                throw err;
            }
            l = result.length;
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
                            "message": 'Password has been change successfully'
                        }
                });
                res.end();
            }
        });
    }
});


module.exports = router;
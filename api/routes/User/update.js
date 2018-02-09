var express = require('express');
var router = express.Router();

router.put("/user/update", function (req, res, next) {
    var user_id = req.query.ID;
    var newName = req.body.name;
    var newPassword = req.body.password;
    var newMail = req.body.mail;
    var is_staff = req.body.is_staff;

    var sql_data = 'UPDATE user \
    SET user.Email = "' + newMail + '", user.Name = "'+newName+'", user.Password = "'+ newPassword +'", user.Is_staff = "'+is_staff+ '"  \
    WHERE user.ID = "' + user_id + '"';

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
                        "message" : 'User does not exist'
                    }
            });
            res.end();
        }
        else {
            res.json({
                "results":
                    {
                        "status": 200,
                        "message" : 'The user has been changed successfully'
                    }
            });
            res.end();
        }
    });
});


module.exports = router;
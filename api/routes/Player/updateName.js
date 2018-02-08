var express = require('express');
var router = express.Router();
var jwt_handler = require('../../controllers/check_jwt');

router.use(jwt_handler);

router.put("/updateName", function (req, res, next) {
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
                        "message" : 'Name has been change successfully'
                    }
            });
            res.end();
        }
    });
});


module.exports = router;
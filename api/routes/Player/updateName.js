var express = require('express');
var router = express.Router();
var jwt_handler = require('../../controllers/check_jwt');

router.use(jwt_handler);

router.put("/player/updateName", function (req, res, next) {
    var user_id = req.decoded_data.Id;
    var oldName = req.body.oldName;
    var newName = req.body.newName;


    if (!req.body.oldName) {
        res.status(422).send({"results": {"status": 422, "error": "Parameter oldName is incorrect or missing"}});
    }
    else if (!req.body.newName) {
        res.status(422).send({"results": {"status": 422, "error": "Parameter newName is incorrect or missing"}});
    }
    else {
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
                            "message": 'Name has been change successfully'
                        }
                });
                res.end();
            }
        });
    }
});


module.exports = router;
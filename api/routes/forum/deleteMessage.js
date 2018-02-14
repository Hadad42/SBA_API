var express = require('express');
var router = express.Router();
var jwt_handler = require('../../controllers/check_jwt');

router.use(jwt_handler);

router.delete('/:topic/message/:id/delete', function (req, res, next) {
    var player_id = req.decoded_data.Id;
    if (!req.params.topic || isNaN(req.params.topic)){
        res.status(422).send({"results":{ "status": 422, "error": "parameter Forum topic is incorrect or missing"}});
        res.end();
        return;
    }
    if (!req.params.id || isNaN(req.params.id)){
        res.status(422).send({"results":{ "status": 422, "error": "parameter id_msg is incorrect or missing"}});
        res.end();
        return;
    }
    db.query("DELETE FROM `message` WHERE author_id=" + player_id + " AND ID=" + req.params.id,
        function(err, result) {
            if (err) {
                db.rollback(function() {
                    throw err;
                });
            }
            l = result.length;
            if (l === 0) {
                res.json({"results": {
                    "status": 403,
                    "error": "You are not allowed to delete this message"
                }}) ;
            }
            else {
                console.log(result);
                res.json({"results": {
                    "status": 201,
                    "success": "Message Successfully deleted"
                }}) ;
            }
            res.end();
        });
});

module.exports = router;
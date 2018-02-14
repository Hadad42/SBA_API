var express = require('express');
var router = express.Router();
var jwt_handler = require('../../controllers/check_jwt');

router.use(jwt_handler);

router.delete('/:topic/delete', function (req, res, next) {
    var player_id = req.decoded_data.Id;
    db.beginTransaction(function(err) {
        if (err) { throw err; }
        if (!req.params.topic || isNaN(req.params.topic) === true){
            res.status(422).send({"results":{ "status": 422, "error": "Parameter forum topic is incorrect or missing"}});
            res.end();
            return;
        }
        var first = "DELETE FROM `forum` WHERE ID=" + req.params.topic + " AND Author_id=" + player_id;
        console.log(first);
        db.query(first,
            function(err, result) {
                if (err) {
                    db.rollback(function () {
                        throw err;
                    });
                }
                console.log("1st query result is ", result);
                l = result.length;
                if (l === 0) {
                    db.rollback(function () {
                        throw err;
                    });
                    res.json({"results": {
                        "status": 403,
                        "error": "You are not allowed to delete this Topic"
                    }}) ;
                    res.end();
                    return;
                }
                if (result.affectedRows === 0){
                    res.status(202).send({"results": {
                        "status": 202,
                        "success": "This topic does not exist"
                    }}) ;
                    res.end();
                    return;
                }
                db.query("DELETE FROM `message` WHERE Forum_id=" + req.params.topic,
                    function(err, result) {
                        if (err) {
                            db.rollback(function() {
                                throw err;
                            });
                        }
                        console.log(result);
                        res.json({"results": {
                            "status": 201,
                            "success": "Forum Topic Successfully Deleted"
                        }}) ;
                        db.commit(function(err) {
                            if (err) {
                                db.rollback(function () {
                                    throw err;
                                });
                            }
                        });
                        res.end();
                    });
            });
    });
});

module.exports = router;
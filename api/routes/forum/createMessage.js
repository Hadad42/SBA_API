var express = require('express');
var router = express.Router();
var jwt_handler = require('../../controllers/check_jwt');

router.use(jwt_handler);


function create_insert_query(req) {
    var player_id = req.decoded_data.Id;
    console.log("player_id est", player_id);
    var insert_query = "INSERT INTO `message`(`ID`, `Author_id`, `Forum_id` , `Content`";
    insert_query += ") VALUES ('', " + player_id + ", " + req.params.topic + ", '" + req.body.content + "'";
    insert_query += ");";
    return insert_query;
}

router.post('/:topic/message/post', function (req, res, next) {
    /* Begin transaction */
    console.log("Transaction begin");
    db.beginTransaction(function(err) {
        if (err) { throw err; }
        if (!req.params.topic || isNaN(req.params.topic)){
            res.status(422).send({"results":{ "status": 422, "error": "Parameter forum topic is missing"}});
            res.end();
            return;
        }
        if (!req.body.content ){
            res.status(422).send({"results":{ "status": 422, "error": "Parameter content is missing"}});
            res.end();
            return;
        }
        var insert_query = create_insert_query(req);
        console.log("insert is ", insert_query);
        db.query(insert_query, function(err, result) {
            if (err) {
                db.rollback(function() {
                    throw err;
                });
            }
            console.log(result);
            db.commit(function(err) {
                if (err) {
                    db.rollback(function () {
                        throw err;
                    });
                }
            });
            res.status(201).send({"results": {
                "status": 201,
                "success": "Message successfully posted"
            }});
            res.end();
        });
    });
    console.log('Transaction Complete.');
    /* End transaction */
});

module.exports = router;
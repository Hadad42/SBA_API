var express = require('express');
var router = express.Router();
var jwt_handler = require('../../controllers/check_jwt');

router.use(jwt_handler);


function create_insert_query(req) {
    var player_id = req.decoded_data.Id;
    console.log("player_id est", player_id);
    var insert_query = "INSERT INTO `forum`(`ID`, `Author_id` , `Name`, `Tags`";
    insert_query += ") VALUES ('', " + player_id + ", '" + req.body.name + "', ";
    if (req.body.tags && Array.isArray(req.body.tags)){
        insert_query += "'";
        for(i = 0; i < req.body.tags.length; i++){
            insert_query += String(req.body.tags[i]);
            if (i < req.body.tags.length - 1)
                insert_query += ', ';
        }
        insert_query += "'";
    }
    else {
        insert_query += "''";
    }
    insert_query += ");";
    return insert_query;
}

router.post('/create', function (req, res, next) {
    /* Begin transaction */
    console.log("Transaction begin");
    db.beginTransaction(function(err) {
        if (err) { throw err; }
        if (!req.body.name){
            res.status(422).send({"results":{ "status": 422, "error": "Parameter name is missing"}});
            res.end();
            return;
        }
        if (!req.body.content){
            res.status(422).send({"results":{ "status": 422, "error": "Parameter content is missing"}});
            res.end();
            return;
        }
        var insert_query = create_insert_query(req);
        db.query(insert_query, function(err, result) {
            if (err) {
                db.rollback(function() {
                    throw err;
                });
            }
            // console.log(result);
            db.commit(function(err) {
                if (err) {
                    db.rollback(function () {
                        throw err;
                    });
                }
            });
            res.json({"results": {
                "status": 201,
                "success": "Forum Topic Successfully Created"
            }}) ;
            res.end();
        });
    });
    console.log('Transaction Complete.');
    /* End transaction */
});

module.exports = router;
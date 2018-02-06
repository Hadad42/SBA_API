var express = require('express');
var router = express.Router();
var jwt_handler = require('../../controllers/check_jwt');
var card_checker = require('./tools/check_card_faction');

router.use(jwt_handler);

function create_update_query(req) {
    var player_id = req.decoded_data.Id;
    return ('UPDATE deck' +
        ' SET `deck.Name`=' + req.body.name +
        ' WHERE deck.Player_id=' + player_id + ' AND deck.Hero_id=' + req.body.hero_id)
}

router.put('/updateDeck', function (req, res, next) {
    /* Begin transaction */
    console.log("Transaction begin");
    db.beginTransaction(function(err) {
        if (err) { throw err; }
        /* Get Hero Faction */
        var update_query = create_update_query(req);
        db.query(update_query, function(err, result) {
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
            res.json({"results": {
                "status": 201,
                "success": "Deck Successfully Updated"
            }}) ;
            res.end();
        });
    });
    console.log('Transaction Complete.');
    /* End transaction */
});

module.exports = router;
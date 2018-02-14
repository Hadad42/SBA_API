var express = require('express');
var router = express.Router();
var jwt_handler = require('../../controllers/check_jwt');

router.use(jwt_handler);


function query_commit(req, res, next) {
    db.commit(function(err) {
        if (err) {
            db.rollback(function () {
                throw err;
            });
        }
    });
    res.status(200).send({"results":{
        "status": 200,
        "success": "Cards succesfully dismantled"
    }}) ;
    res.end();
}


// Query Add corresponding number of partt from the dismantle
function query_update_part(req, res, next, to_decraft) {
    var sum=0;
    for(var i=0;i<to_decraft.length;i++){
        console.log("sum is ", sum);
        console.log("num is ", to_decraft[i].num);
        console.log("cost is ", to_decraft[i].decraft);
        sum+= to_decraft[i].num * to_decraft[i].decraft;
    }
    console.log("final sum is ", sum);
    var add_part = "UPDATE `player` SET `player`.Part=`player`.Part+" + sum +
        " WHERE `player`.ID=" + req.decoded_data.Id;
    console.log("query is ", add_part);
    db.query(add_part, req.decoded_data.Id,
        function(err, result) {
            if (err) {
                db.rollback(function () {
                    throw err;
                });
            }
            console.log(result);
            query_commit(req, res, next)
        });
}

// Query Decrease number of Card
function query_update_card(req, res, next, to_decraft) {
    var decraft_card = "UPDATE `card_collection` " +
        "SET `Number` = 3 " +
        "WHERE `Player_id`=1 AND ";
    for (var i=0; i<to_decraft.length; i++){
        decraft_card += "`Card_id`=" + to_decraft[i].card;
        if (i < (to_decraft.length - 1)){
            decraft_card += " OR ";
        }
    }
    decraft_card += ";";
    console.log("decraft is ", decraft_card);
    db.query(decraft_card, req.decoded_data.Id,
        function(err, result) {
            if (err) {
                db.rollback(function () {
                    throw err;
                });
            }
            console.log(result);
        });
    query_update_part(req, res, next, to_decraft);
}

router.delete('/dismantle', function (req, res, next) {
    /* Begin transaction */
    console.log("Transaction begin");
    db.beginTransaction(function(err) {
        if (err) { throw err; }
        /* Get Player's List of Card */
        var card_rarety = 'SELECT ' +
            'card_collection.Card_id AS "card", card_collection.Number - ' + process.env.DUPLICATE_CARD_LIMIT + ' AS "num", ' +
            'card.Rarity_id AS "rarity", ' +
            'rarety.Decraft_cost AS "decraft" ' +
            'FROM `card_collection` ' +
            'JOIN `card` ON `card_collection`.Card_id=`card`.ID ' +
            'JOIN `rarety` ON `card`.Rarity_id=`rarety`.ID ' +
            'WHERE card_collection.Player_id=? AND card_collection.Number > ' + process.env.DUPLICATE_CARD_LIMIT;
        console.log("cards are ", card_rarety);
        db.query(card_rarety, req.decoded_data.Id,
            function(err, result) {
                if (err) {
                    db.rollback(function() {
                        throw err;
                    });
                }
                console.log("1st query result is ", result);
                if (result.length === 0) {
                    console.log("Ca s'arrete");
                    res.status(201).send({"results": {
                        "success": "There is no dismantable cards"
                    }})
                }
                else{
                    console.log("Ca continue");
                    query_update_card(req, res, next, result)
                }
           });
    });
    console.log('Transaction Complete.');
    /* End transaction */
});

module.exports = router;
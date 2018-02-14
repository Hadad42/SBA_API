var express = require('express');
var router = express.Router();
var jwt_handler = require('../../controllers/check_jwt');

router.use(jwt_handler);

function create_select_query(req) {
    var select_query =
        'SELECT `ID`, `Author_id`, `Forum_id`, `Content`, `Creation_date`, `Modification_date` ' +
        'FROM `message` ' +
        'WHERE `Forum_id`=' + req.params.topic + ' ';
    // Limit results per page
    if (!req.body.results_per_page || isNaN(req.body.results_per_page) === true)
        select_query += 'LIMIT 20 ';
    else
        select_query += 'LIMIT ' + req.body.results_per_page + ' ';
    // Add Offset
    if (req.body.offset || isNaN(req.body.offset) === false)
        select_query += 'OFFSET ' + req.body.results_per_page + ' ';

    select_query += ';';
    return select_query
}


router.get('/:topic', function (req, res, next) {
    var player_id = req.decoded_data.Id;
    console.log("id est", player_id);
    var ret = {
        "status": "200",
        "messages": []
    };
    console.log("t id is ", req.params.id);
    if (!req.params.topic || isNaN(req.params.topic) === true){
        res.status(422).send({"results":{ "status": 422, "error": "Parameter forum topic is incorrect or missing"}});
        res.end();
        return;
    }
    var select_query = create_select_query(req);
    console.log("q is ", select_query);
    var query = db.query(select_query, function (err, results) {
        if (err){
            throw err;
        }
        else {
            if (results !== ""){
                console.log(results);
                ret.messages = results;
                res.json(ret);
                res.end()

            }
        }
    });
});

module.exports = router;
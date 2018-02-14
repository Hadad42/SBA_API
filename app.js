/*
Package dependenies
*/
var express = require('express');
var app = express();
var http = require('http');
var path = require('path');
var cors = require('cors');  // to allow cors
var bodyParser = require('body-parser'); // to get request parameter

var morgan = require('morgan');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var mysql = require('mysql');
require('dotenv').config(); // to get information of database and JWT

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// ------------------------------------connect to database--------------------------------------------------------

connection.connect(function (err) {
    if (!err) {
        console.log("Database is connected ... ");
    }
    else {
        console.log("Error connecting Database ... ");
        console.log(err);
    }
});

global.db = connection;

//-------------------------------------configure environment-----------------------------------------------------------------

app.set('port', process.env.PORT || 3000); // set port
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

// ------------------------------------get request parameters------------------------------------------------------

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//-------------------------------------log to console---------------------------------------------------------------

app.use(morgan('dev'));

//-------------------------------------set header to allow cors---------------------------------------------------------

app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
});

//access to article folder
app.use('/articles',express.static('articles'));

//-------------------------------------routes-----------------------------------------------------------------------
//var user        = require('./api/routes/user');
var index = require('./api/routes/index');
var reg_handler = require('./api/routes/registrationHandler');
var con_handler = require('./api/routes/connectionHandler');
var player_handler = require('./api/routes/Player/playerHandler');
var player_part = require('./api/routes/Player/addPart');
var player_gold = require('./api/routes/Player/addGold');
var player_name = require('./api/routes/Player/updateName');
var player_mail = require('./api/routes/Player/updateMail');
var player_password = require('./api/routes/Player/updatePassword');
var getRank = require('./api/routes/Player/getRank');

var user_getAll = require('./api/routes/User/getAll');
var user_delete = require('./api/routes/User/delete');
var user_update = require('./api/routes/User/update');
var user_getById = require('./api/routes/User/getById');

var article_getAll = require('./api/routes/Article/getAll');
var article_create = require('./api/routes/Article/create');
var article_update = require('./api/routes/Article/update');
var article_delete = require('./api/routes/Article/delete');
var article_getById = require('./api/routes/Article/getById');

var rankedPartyWin = require('./api/routes/RankedParty/win');
var rankedPartyEquality = require('./api/routes/RankedParty/equality');
var rankedPartyDefeat = require('./api/routes/RankedParty/defeat');



//Registration Handler
app.use('/', index);
app.post('/signup', reg_handler);
app.post('/signin', con_handler);
//app.use('/signup', reg_handler);

app.use('/forum', require('./api/routes/forum/routes'));
app.use('/cards', require('./api/routes/Card/routes'));
app.use('/booster', require('./api/routes/booster/routes'));

//User
app.get('/user/getAll', user_getAll);
app.get('/user/getById', user_getById);
app.delete('/user/delete', user_delete);
app.put('/user/update', user_update);

//Article
app.get('/article/getAll', article_getAll);
app.get('/article/getById', article_getById);
app.post('/article/create', article_create);
app.put('/article/update', article_update);
app.delete('/article/delete', article_delete);

//Player Handler
app.get('/player/getInformation', player_handler);
app.get('/player/getRank', getRank);
app.put('/player/addPart', player_part);
app.put('/player/addGold', player_gold);
app.put('/player/updateMail', player_mail);
app.put('/player/updateName', player_name);
app.put('/player/updatePassword', player_password);

//Ranked Party
app.put('/rankedParty/win', rankedPartyWin);
app.put('/rankedParty/equality', rankedPartyEquality);
app.put('/rankedParty/defeat', rankedPartyDefeat);


/*
error handler
if error is encountered, display error and stacktrace
 */
app.use(require('./api/errors'));

// app.use('/users', users);

http.createServer(app).listen(app.get('port'), function () {
    console.log('SBA server listening on port ' + app.get('port'));
});
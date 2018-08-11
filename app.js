var express = require('express');
var db=require('./models/db.js');
var chalk = require('chalk');
var bodyParser=require('body-parser');
var session=require('express-session');
var flash = require('express-flash-messages');
var cors = require('cors');



var app = express();
app.set('view engine', 'ejs');
app.use(flash());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
app.use(session({secret:"qazwsxedcrfvtgbyhnujm",resave: true, saveUninitialized: true}));

var routeAPI = require('./routes/route.js');

port = process.env.PORT || 8080;

app.get('/createNewAdminUser', function(req, res){
    console.log(chalk.yellow('recieved the req from client'))
    res.render('adminUser');
});

app.post('/adminLogin', routeAPI.adminLogin);

app.post('/createAdmin', routeAPI.adminCreate);

app.listen(port, function(){
    console.log(chalk.green('server is up and running'));
});
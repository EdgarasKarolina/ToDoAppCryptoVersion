
var express = require('express');//web app framework for nodejs
var path = require('path');//provides utilities for working with file and directory paths 
var morgan = require('morgan');//logs incoming requests to the console
var cookieParser = require('cookie-parser'); //will parse the Cookie header and handle cookie separation and encoding
var bodyParser = require('body-parser');//extracts the entire body portion body portion of an incoming request stream
// and exposes it on req.body as something easier to interface with
var mongoose = require('mongoose');
//var ObjectId = require('mongoose').ObjectID;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; //strategy for authentication with username and password
var flash = require('connect-flash');//used to display flash messages f.x. if user entered wrong password
var routes = require('./routes/routes');

const crypto2 = require('crypto2'); //requiring crypto2 library

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morgan('dev'));//whenever the is request it will go through 'morgan' first
app.use(bodyParser.json()); // parser accepts only UTF-8 encoding of the body
//extended option allows to choose between parsing 
//the URL-encoded data with the querystring library (when false) 
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(flash());
app.use(passport.session());
app.use(express.static('public'));//serving static files like css
app.use('/', routes);//uses routes folder


//using Account object for authentication
var Account = require('./models/userAccount');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


//connecting to database
var uri = 'mongodb://edgaras:belekas@ds129386.mlab.com:29386/todoapplication';
mongoose.connect(uri);

//handling errors

app.use(function(req, res) {
    var err = new Error('Not Found');
    err.status = 404;
    res.send('There was an error dude');
});  


  app.set( 'port', ( process.env.PORT || 3000 ));
  // Start node server
  app.listen( app.get( 'port' ), function() {
    console.log( 'Node server is running on port ' + app.get( 'port' ));
    });


module.exports = app;

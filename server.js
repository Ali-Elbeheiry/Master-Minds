
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieparser = require ('cookie-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var multer = require('multer');
var fs = require('fs');
var DB_URI = "mongodb://777_x_amr_x_777:777505777505amr@ds062059.mlab.com:62059/breakout";
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var path = require('path')
var multer = require('multer');
var fs = require('fs');
var router = require('./app/routes');
var app = express();
var expressValidator = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;
var path = require('path');

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, sid");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
    next();
});

// Express Session

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());
/* PASSPORT WAS HERE*/


// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));


mongoose.Promise = global.Promise;
mongoose.connect(DB_URI,function(err){
  if(err){
    console.log(err);
  }else{
    console.log("Connected to DB successfuly");
  }
});


//Configure app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/businessowner'));
app.use('/routes', router);
app.use(router);

app.use(flash());



app.use(function(req, res, next) {
    res.locals.login = req.isAuthenticated();
    next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('@ Found');
    err.status = 404;
    next(err);
});


//Configure app

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        // res.render('error', {
        //     message: err.message,
        //     error: err
        // });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



module.exports = app;


// Global Vars
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.client = req.client || null;
    next();
});

var port = process.env.PORT || 8080;
//Start the server
app.listen(port, function(){
    console.log("server is listening on port 8080");

})

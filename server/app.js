const createError = require('http-errors');
const express = require('express');
const reload = require('express-reload')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require("body-parser");
const mustacheExpress = require('mustache-express');

const mongo = require('./services/mongo');
const apiRoutes = require('./routes/api');
const hitRoutes = require('./routes/index');
const mturkManagementRoutes = require('./routes/mturk');

let app = express();

// Connection URL

// view engine setup
// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.disable('view cache');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', hitRoutes);
app.use('/mturk/', mturkManagementRoutes);
app.use('/api/', apiRoutes);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

//hot reload path
var path_index = __dirname + '/routes/';
app.use(reload(path_index));

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//TODO this is broken. npm start gives a server on 3000
app.listen(3001, '0.0.0.0');


module.exports = app;

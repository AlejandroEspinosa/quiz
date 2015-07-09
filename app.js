var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');
var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('QuIzAlEx')); // Pasamos una semilla para cifrar
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinámicos
app.use(function(req, res, next) {
    // Guarda path en session.redir para redirigir a la página que originó el login
    if (!req.path.match(/\/login|\/logout/)) {
        req.session.redir = req.path;
    }

    // Guarda session en local para poder recuperarlo en las vistas
    res.locals.session = req.session;

    // SESSION TIMEOUT
    // Si hay session.user comprueba que no haya trascurrido más de 2 min
    // desde la petición anterior. En caso contrario destruye la sesión.
    if (req.session.user) {
        var ahora = new Date();
        var hace_dos_minutos = new Date(ahora);
        hace_dos_minutos.setMinutes(ahora.getMinutes() - 2);
        var ultimo_acceso = new Date(req.session.last_request);
        if (ultimo_acceso < hace_dos_minutos) {
            console.log('Han pasado más de 2 minutos. Borrando Sesión.');
            delete req.session.user;
            req.session.destroy();
        } else {
            req.session.last_request = ahora.toJSON();
        }
    }

    next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
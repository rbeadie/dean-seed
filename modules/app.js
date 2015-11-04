var express = require('express');
var config = require('./config');

// Initialize express app
var app = express();

// Initialize local variables
app.locals.title = config.app.title;
app.locals.description = config.app.description;
app.locals.logo = config.app.logo;
app.locals.favicon = config.app.favicon;

// Initialize middleware
var bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),
    methodOverride = require('method-override'),
    logger = require('morgan'),
    pkgfinder = require('pkgfinder');
var pkg = pkgfinder(); 
app.use(favicon(pkg.resolve(app.locals.favicon)));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(pkg.resolve('public')));

//Configure view engine
app.set('views', pkg.resolve('views'));
app.set('view engine', 'jade');

// //Configure authentication
// var session = require('express-session'),
//     cookieParser = require('cookie-parser'),
//     passport = require('passport');  
// app.use(cookieParser());
// app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: false }));
// app.use(passport.initialize());
// app.use(passport.session());

// Routes
var routes = require('../routes');
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
var DocDBDao = require('./docdbdao');
var DocumentDBClient = require('documentdb').DocumentClient;
var docDbClient = new DocumentDBClient(config.db.host, { masterKey: config.db.authKey});
var dao = new DocDBDao(docDbClient, config.db.databaseId, config.db.collectionId);
dao.init();

app.get('/api/items', dao.getItems.bind(dao));

app.get('/api/item/:id', dao.getItem.bind(dao));
app.post('/api/item', dao.addItem.bind(dao));
app.post('/api/item/:id', dao.updateItem.bind(dao));
app.delete('/api/item/:id', dao.deleteItem.bind(dao));

app.get('*', routes.index);

// Configure server
app.set('port', process.env.PORT || config.port);

module.exports = app;


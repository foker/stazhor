module.exports = function (app, express) {
    var ejs = require('ejs-locals'),
        path = require('path'),
        config = require('../config'),

        mongoose = require('mongoose'),
        MongoStore = require('connect-mongo')(express),
        router = require('../routeBuilder');


    /**
     * Page Rendering
     * */
    app.engine('html', ejs);
    app.engine('ejs', ejs);
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');

    /**
     * Session
     * */
    app.use(express.bodyParser());
    app.use(express.cookieParser());
	app.use(express.session({
		secret: 'my secret',
		store: new MongoStore({'db': 'sessions'})
	}));



    /**
     * Routing
     * */
    app.use(app.router);
    router(app);

    /**
     * Public directory
     * */
    app.use(express.static(path.join(__dirname, '../public')));
    app.use("/public", express.static(path.join(__dirname, '../public')));
};
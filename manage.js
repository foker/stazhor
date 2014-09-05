var mongoose = require('mongoose'),
    async = require('async'),
    User = require('./models/user'),
    config = require('./config');

function openConnection(cb) {
    mongoose.connection.on('open', function () {
        log.info('connected to database ' + config.get('db:name'));
        cb();
    });
}

function dropDatabase(cb) {
    var db = mongoose.connection.db;
    db.dropDatabase(function () {
        log.info('dropped database ' + config.get('db:name'));
        cb();
    });
}

function createBaseUser(cb) {
    var admin = new User({
        username: 'admin',
        password: config.get('project:admin:password'),
        email: config.get('project:admin:email'),
        role: 1
    });
    admin.save(function () {
        log.info('created database ' + config.get('db:name'));
        log.info('created base admin user');
        cb();
    });
}

function ensureIndexes(cb) {
    async.each(Object.keys(mongoose.models), function (model, callback) {
        mongoose.models[model].ensureIndexes(callback);
    }, function () {
        log.info('indexes ensured completely');
        cb();
    });
}

function closeConnection() {
    mongoose.disconnect();
    log.info('disconnected');
}

async.series(
    [
        openConnection,
        dropDatabase,

        createBaseUser,

        ensureIndexes
    ],
    closeConnection
);
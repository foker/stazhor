var config = require('../config');

var sendHttpError = function (error, res) {
    res.status(error.status);

    if (res.req.xhr) {
        res.json(error);
    } else {
        res.render('error', {
            error: {
                status: error.status,
                message: error.message,
                stack: config.get('debug') ? error.stack : ''
            },
            project: config.get('project')
        });
    }
};

module.exports = function (app, express) {
    var log = require('winston')(app, module);

    return function(err, req, res, next) {
        if (typeof err === 'number') {
            err = new HttpError(err);
        }
        if (err instanceof HttpError) {
            sendHttpError(err, res);
        } else {
            if (app.get('env') === 'development') {
                express.errorHandler()(err, req, res, next);
            } else {
                log.error(err);
                err = new HttpError(500);
                sendHttpError(err, res);
            }
        }
    };
};
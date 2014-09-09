/**
 * Created by gerasimovnv on 30.07.2014.
 */

var q = require('q');
var _ = require('underscore');
var path = require('path');
var routeObject = require('./routeObject.js');

module.exports = function (app) {


    var validateWrapper = function (configController) {
        return function (req, res, next) {
            /*if (!configController['valid']) return next();
            var def = q.defer();

            configController.valid(req, def)
                .then(next)
                .catch(function (err) {
                    console.log(err);
                    return next();
                })*/
            next();
        };
    };

    var authWrapper = function (configController) {
        return function (req, res, next) {
            if (!configController['auth']) return next();
            var def = q.defer();
            configController.auth(req, def)
                .then(next)
                .catch(function (err) {
                    console.error(err);
                    return next(err);
                })
        }
    };

    var controllerWrapper = function (configController) {
        return function (req, res, next) {
            var def = q.defer();
            if (!configController['action']){
                console.log('controller doesnt"t exists'+configController);
                return next();
            }
            console.log(configController['action']);
            var isAsync = false;
            configController.action(req, def)
                .then(function(data){
                    console.log(1);
                    if(data.data === undefined){
                        if (data.address==undefined)  return res.send({code:500, message:'bad render data'});
                        else return res.redirect(data.address);
                    }
                    if(isAsync) return res.send(data.data);
                    return res.render(data.address, data.data);
                    next();
                }, function(err){
                    res.render('common/error',err);
                    next();
                });
        }
    };

    return _.each(routeObject, function (val, key) {
        return _.each(val, function(route){
            var pathFile = './controllers/'+key+'/'+route['action'];
            try {
                var controllerObject = require(pathFile);
            } catch (e) {
                first = false;
                console.log("Not exist controller file: " + pathFile);
                return;
            }
            if (!controllerObject['action']) return;
            return app[route['method']](route['path'], validateWrapper(controllerObject), authWrapper(controllerObject), controllerWrapper(controllerObject));
        });

    })

};
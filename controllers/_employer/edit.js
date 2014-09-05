/**
 * Created by gerasimovnv on 22.07.2014.
 */

var Employer = require('../../models/employer')
    , City = require('../../models/city');

module.exports = {
    valid: false,
    auth: Employer.updateLink,
    action: function(req, def){
        if(!req.userGroup || req.userGroup!=1) def.reject({code:403});
        City.list()
            .then(function(list){
                return [Employer.findOne({id:link.result},'title desc site phone mail city address').exec(), list];
            }, function(err){
                return def.reject(err);
            })
            .spread(function(result, list){
                if(!result) return def.reject({code:404});
                return def.resolve({address:'employer/edit-card', data:{
                    card:result,
                    userGroup:req.userGroup,
                    cities: list.result
                }});
            }, function(err){
                return def.reject({code:500, message: err});
            });
        return def.promise;
    }
};
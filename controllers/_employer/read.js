/**
 * Created by gerasimovnv on 22.07.2014.
 */

var Employer = require('../../models/employer');

module.exports = {
    valid: false,
    auth: Employer.updateLink,
    action: function(req, def){
        Employer.findOne({id:req.param('id')}, 'title desc').exec()
            .then(function(result){
                if(!result) return def.reject({code:404});
                return def.resolve({address:'employer/employer',data:{
                    employer:result,
                    userGroup: req.userGroup
                }});
            }, function(err){
                return def.reject({code:500, message: err});
            });

        return def.promise;
    }
};
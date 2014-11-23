/**
 * Created by gerasimovnv on 22.07.2014.
 */

var updateLink = require('../../models/user').updateLink
    , Employer = require('../../models/employer');

module.exports = {
    valid: false,
    auth: updateLink,
    action: function(req, def){
        if(!req.userId) def.resolve({address:'/admin/auth'});
        else if(req.userGroup!=2) def.resolve({address:'/cabinet'});
        else Employer.getList(req.query.page)
            .then(function(data){
                console.log(14);
                return def.resolve({address:'admin/panel',data:{userGroup:req.userGroup, emps: data}});
            }, function(err){
                def.reject(err);
            });

        return def.promise;
    }
};
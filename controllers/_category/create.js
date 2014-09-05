/**
 * Created by gerasimovnv on 22.07.2014.
 */

var updateLink = require('../../models/user').updateLink
    , Category = require('../../models/category');

module.exports = {
    valid: {
        notEmpty: [
            {type: 'body', title:'title'},
            {type: 'body', title:'parent'}
        ]
    },
    auth: updateLink,
    action: function(req, def){
        if(!req.userGroup  || req.userGroup!= 2) def.resolve({address:'/auth'});
        else Category.newOne(req.body.title, req.body.parent)
            .then(function(){
                def.resolve({address:'/admin/categories'})
            }, function(err){
                def.reject(err);
            });

        return def.promise;
    }
};
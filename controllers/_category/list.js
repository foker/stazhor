/**
 * Created by gerasimovnv on 22.07.2014.
 */

var updateLink = require('../../models/user').updateLink
    , Category = require('../../models/category');

module.exports = {
    valid: false,
    auth: updateLink,
    action: function(req, def){
        if(!req.userId || req.userId!=2) def.reject({code:404});
        Category.getTree(0, false)
            .then(function(tree){
                def.resolve({address:'category/categories', data:{
                    categories:tree.result,
                    userGroup:req.session.userGroup
                }});
            }, function(err){
                def.reject(err);
            });

        return def.promise;
    }
}
/**
 * Created by gerasimovnv on 22.07.2014.
 */

var updateLink = require('../../models/admin').updateLink
    , Category = require('../../models/category');

module.exports = {
    valid: false,
    auth: updateLink,
    action:function(req, def) {
        if (!req.userGroup || req.userGroup != 2) def.reject({code: 404});
        Category.findOne({id:req.param('id')}, 'title id parent').exec()
            .then(function(result){
                if(!result) return def.reject({code:404});
                return def.resolve({address:'category/edit-category', data: {category: result, userGroup: req.userGroup}});
            }, function(err){
                return def.reject({code:500, message:err});
            });

        return def.promise;
    }
};
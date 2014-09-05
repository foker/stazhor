/**
 * Created by gerasimovnv on 22.07.2014.
 */

var updateLink = require('../../models/user').updateLink
    , Category = require('../../models/category');

module.exports = {
    valid: {
        noEmpty:[
            {type:'query', title:'parent'},
            {type:'query', title:'title'}
        ]
    },
    auth: updateLink,
    action: function(req, def){
        if(!req.userGroup || req.userGroup!=2) def.reject({code:404})
        Category.findOne({id:req.param('id')}, 'title id parent').exec()
            .then(function(result){
                if(!result) return def.reject({code:404});
                for(key in result){
                    if(req.body[key]) result[key] = req.body[key];
                }
                return result.save(function(err){
                    if(err) return def.reject({code:500, message: err});
                    return def.resolve({address:'/admin/categories'});
                });
            }, function(err){
                return def.reject({code:500, message:err});
            });

        return def.promise;
    }
};
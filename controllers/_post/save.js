/**
 * Created by gerasimovnv on 21.07.2014.
 */

var Post = require('../../models/post')
    , Employer = require('../../models/employer');

module.exports = {
    valid: {
        noEmpty: [
            {type:'query', title:'title'},
            {type:'query', title:'desc'},
            {type:'query', title:'city'},
            {type:'query', title:'phone'},
            {type:'query', title:'category'}
        ]
    },
    auth: Employer.updateLink,
    action: function (req, def){
        if(!req.userId) def.reject({code:403});
        Post.checkAuthor(req.param('id'), req.userId)
            .then(function(){
                return Post.findOne({id:req.param('id')}).exec();
            })
            .then(function(result){
                if(!result) return def.reject({code:404});
                for(prop in req.body){
                    if(result[prop]) result[prop] = req.body[prop];
                }
                return result.fresh();
            },function(err){
                return def.reject({code:500, msg:err});
            })
            .then(function(){
                return def.resolve({address:'/edit/'+req.param('id')});
            })
            .catch(function(err){
                return def.reject(err);
            });

        return def.promise;
    }
};

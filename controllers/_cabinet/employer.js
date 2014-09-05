/**
 * Created by gerasimovnv on 22.07.2014.
 */

var updateLink = require('../../models/user').updateLink
    , Post = require('../../models/post')
    , City = require('../../models/city')
    , async = require('async');

module.exports = {
    valid: false,
    auth: updateLink,
    action: function(req, def){
        if(req.userGroup==2) def.resolve({address:'/admin'});
        else if(!req.userId) def.resolve({address:'admin/authorization', data:{}});
        else Post.getAuthorList(req.userId)
            .then(function(data){
                if(!data.result || !data.result.length) return def.resolve({address:'employer/cabinet',data: {posts: [], userGroup: 1, editable:true}});
                var posts = [];
                return async.each(data.result, function(item, next){
                    var post = {};
                    for(key in item){
                        if(typeof item[key] != 'undefined') post[key] = item[key];
                    }
                    City.getTitle(item.city)
                        .then(function(result){
                            post.city = result.result;
                            posts.push(post);
                            next();
                        }, function(err){
                            next(err);
                        });
                }, function(err){
                    if(err) return def.reject(err);
                    return def.resolve({address:'employer/cabinet',data: {posts: posts, userGroup: 1, editable:true}});
                });
            }, function(err){
                return res.send(err);
            });

        return def.promise;
    }
};
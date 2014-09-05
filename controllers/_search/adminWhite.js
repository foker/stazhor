/**
 * Created by gerasimovnv on 21.07.2014.
 */

var updateLink = require('../../models/admin').updateLink
    , Sidebar = require('../../models/sidebar')
    , Post = require('../../models/post')
    , Search = require('../../models/search');

module.exports = {
    valid: false,
    auth: updateLink,
    action: function(req, def){
        if(!req.userId || req.userId!=2) def.reject({code:404});
        Search.getList({isActive:2, from: req.param('page')||0})
            .then(function(searchResult){
                return [Sidebar.getData(), searchResult];
            })
            .spread(function(sidebar, searchResult){
                var pages = Post.getPagination(req.url, 1+(searchResult.total/10>>0));
                return def.resolve({address:'admin/panel', data:{
                    posts: searchResult.posts,
                    cats: sidebar.cats,
                    cities: sidebar.cities,
                    userGroup: req.userGroup,
                    editable:false,
                    total: searchResult.total,
                    url: req.url,
                    pages:pages,
                    moder: true
                }});
            })
            .catch(function(err){
                def.reject(err);
            });

        return def.promise;
    }
};
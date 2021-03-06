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
        Search.getList({s: req.query.s, cat: req.query.cat, isActive:2, from: req.param('page')||0})
            .then(function(searchResult){
                return [Sidebar.getData(), searchResult];
            })
            .spread(function(sidebar, searchResult){
                console.log('lal');
                var pages = Post.getPagination(req.url, 1+(searchResult.total/10>>0));

                return def.resolve({address:'common/index', data:{
                    posts: searchResult.posts,
                    cats: sidebar.cats,
                    cities: sidebar.cities,
                    userGroup: req.userGroup,
                    editable:false,
                    total: searchResult.total,
                    url: req.url,
                    pages:pages
                }});
            })
            .catch(function(err){
                def.reject(err);
            });
        return def.promise;
    }
};
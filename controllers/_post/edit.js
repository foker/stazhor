/**
 * Created by gerasimovnv on 21.07.2014.
 */

var Post = require('../../models/post')
    , Employer = require('../../models/employer')
    , Sidebar = require('../../models/sidebar');

module.exports = {
    valid: false,
    auth: Employer.updateLink,
    action: function(req, def){
        Post.checkAuthor(req.param('id'), req.userId)
            .then(function(postData){
                return [Sidebar.getData(), postData];
            })
            .spread(function(Sidebar, postData){
                def.resolve({address:'vacancy/edit', data:{
                    post:postData.post,
                    userGroup:req.userGroup,
                    categories: Sidebar.cats,
                    cities: Sidebar.cities
                }});
            })
            .catch(function(){
                def.reject(err);
             });

        return def.promise;
    }
};
/**
 * Created by gerasimovnv on 21.07.2014.
 */

var Post = require('../../models/post')
    , updateLink = require('../../models/user').updateLink;

module.exports = {
    valid: {
        noEmpty:[
            {type:'body', title: 'title'},
            {type:'body', title: 'desc'},
            {type:'body', title: 'category'}
        ]
    },
    auth: updateLink,
    action: function(req, def){

        var post = new Post(req.body);
        post.saveAndIndex(req)
            .then(function(){
                console.log(21);
                def.resolve({address:'/cabinet'});
            },function(err){
                console.log(31);
                console.log(err);
                def.reject(err);
            });

        return def.promise;
    }
};
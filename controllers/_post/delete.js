/**
 * Created by gerasimovnv on 21.07.2014.
 */

var Post = require('../../models/post')
    , Employer = require('../../models/employer');


module.exports = {
    valid: false,
    auth: Employer.updateLink,
    action: function(req, def){
        //if(!req.userId) def.resolve({address:'/auth'});
        console.log('ща мы будем реально удалять')
        Post.deleteOne(req.param('id'), req.userId)
            .then(function(){
                def.resolve({address:'/cabinet'});
            }, function(){
                def.reject(err);
            });

        return def.promise;
    }
};
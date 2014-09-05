/**
 * Created by gerasimovnv on 21.07.2014.
 */

var Employer = require('../../models/employer')
    , Post = require('../../models/post');

module.exports = {
    valid: {
        noEmpty:[
            {type:'body', title:'login'},
            {type:'body', title:'pass'},
        ]
    },
    auth: Employer.updateLink,
    action:function(req, def){
        console.log(1);
        Employer.enter(1, req)
            .then(function(){
                console.log('все ок')
                def.resolve({address:'/cabinet'});
            })
            .catch(function(err){
                def.reject(err);
            });

        return def.promise;
    }
};
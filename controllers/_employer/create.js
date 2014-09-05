/**
 * Created by gerasimovnv on 21.07.2014.
 */

var Employer = require('../../models/employer');

//TODO создать страницу с успех/неуспех регистрации - отправка сообщения или что

module.exports = {
    valid: {
        noEmpty:[
            {type:'body', title:'login'},
            {type:'body', title:'pass'},
        ]
    },
    auth: Employer.updateLink,
    action:function(req, def){
        Employer.registration(req.body)
            .then(function(){
                def.resolve({address:'/auth'})
            }, function(err){
                def.reject(err);
            });
        return def.promise;
    }
};
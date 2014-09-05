/**
 * Created by gerasimovnv on 22.07.2014.
 */

var Admin = require('../../models/admin');

//TODO: сделать обработку ошибки авторизации - страница  стектсом ошибки

module.exports = {
    valid: {
        notEmpty:['login', 'pass']
    },
    auth: Admin.updateLink,
    action:function(req, def) {

        Admin.enter(2, req)
            .then(function(){
                def.resolve({address:'/cabinet'});
            }, function(err){
                def.reject(err);
            });
        return def.promise;
    }
};
/** * Created by gerasimovnv on 22.07.2014.*/

var Admin = require('../../models/admin');

//TODO: Сделать валидатор всех данных необходимых
//TODO: показать результат регистрации - отправка письма на почту

module.exports = {
    valid: {
        notEmpty:['login', 'pass']
    },
    auth: false,
    action:function(req, def) {
        Admin.registration(req.body)
            .both(function () {
                def.resolve({address:'/admin/auth'});
            });
        return def.promise;
    }
};


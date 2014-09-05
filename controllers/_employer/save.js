/**
 * Created by gerasimovnv on 22.07.2014.
 */

var Employer = require('../../models/employer')
    , Post = require('../../models/post')
    , City = require('../../models/city');

//TODO: проверить сохранение карточки на безопасность, там боз стоит
//TODO: переделать savecars так чтобы стало на один вызов меньше и контроллер соответственно(я про пост)
module.exports = {
    valid: {
        noEmpty:[
            {type:'body', title: 'title'},
            {type:'body', title: 'desc'},
            {type:'body', title: 'phone'},
            {type:'body', title: 'mail'}
        ]
    },
    auth: Employer.updateLink,
    action: function(req, def){
        Employer.saveCard(req, req.userId)
            .then(function(){
                City.list()
            })
            .then(function(list){
                def.resolve({address:'employer/edit-card', data:{
                    card:req.body,
                    userGroup:req.userGroup,
                    cities: list.result
                }});
            })
            .catch(function(err){
                return def.reject(err);
            });

        return def.promise;
    }
};
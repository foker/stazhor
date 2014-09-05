/**
 * Created by gerasimovnv on 21.07.2014.
 */
var Employer = require('../../models/employer')
    , Sidebar = require('../../models/sidebar');

module.exports = {
    valid: false,
    auth: Employer.updateLink,
    action: function(req, def){
        if(!req.userId) def.resolve({address:'/auth'});
        Sidebar.getData()
            .then(function(sidebar){
                return [Employer.findOne({id:req.userId}, 'title site phone city').exec(), sidebar];
            })
            .spread(function(empData, sidebar){
                if(!empData) return def.reject({code:404});  //*****, как такое может быть?
                return def.resolve({address:'vacancy/new-vacancy', data:{
                    data:empData,
                    categories: sidebar.cats,
                    userGroup:req.userGroup,
                    cities: sidebar.cities
                }});
            }, function(){
                return def.reject({code:500, msg:err});
            })
            .catch(function(err){
                return def.reject(err);
            });

        return def.promise;
    }
};
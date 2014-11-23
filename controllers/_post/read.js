/**
 * Created by gerasimovnv on 21.07.2014.
 */
var Post = require('../../models/post')
    , Employer = require('../../models/employer')
    , City = require('../../models/city')
    , Numerator = require('../../models/numerator')
    , Sidebar = require('../../models/sidebar');


module.exports = {
    valid: false,
    auth: Employer.updateLink,
    action: function(req, def){
        Sidebar.getData()
            .then(function(sidebar){
                return [Post.findOne({id: req.param('id')} , 'id title desc salary city company date phone').exec(), sidebar];
            })
            .spread(function(result, sidebar){
                if(!result) return def.reject({code:404});
                return [numerator.inc(req.param('id'), req.connection.remoteAddress), sidebar, result];
            }, function(err){
                def.reject({code:500, msg:err});
            })
            .spread(function(num, sidebar, result){
                return [City.getTitle(result.city), num, sidebar, result];
            })
            .spread(function(city, num, sidebar, result){
                var post = {};
                for(key in result){
                    post[key] = result[key];
                }
                post.city = city.result;
                post.date = Post.preDate(post.date);
                return def.resolve({address:'vacancy/vacancy', data:{
                    post: post,
                    cats: sidebar.cats,
                    cities: sidebar.cities,
                    city: city.result,
                    num: num,
                    id: req.param('id'),
                    userGroup: req.userGroup,
                    moder: (req.userGroup==2)
                }});
            })
            .catch(function(err){
                def.reject(err);
            });

        return def.promise;
    }
};
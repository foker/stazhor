/**
 * Created by gerasimovnv on 21.07.2014.
 */

var updateLink = require('../../models/user').updateLink;

module.exports = {
    valid: false,
    auth: updateLink,
    action:function(req, def){
        req.session.userId ? def.resolve({address:'/cabinet'}) : def.resolve({address:'employer/authorization',data: {}});
        return def.promise;
    }
};
/**
 * Created by gerasimovnv on 22.07.2014.
 */

var updateLink = require('../../models/user').updateLink;

module.exports = {
    valid: false,
    auth: updateLink,
    action: function(req, def){
        req.userId ? def.resolve({address:'/admin'}) : def.resolve({address:'admin/new-admin', data:{}});
        return def.promise;
    }
};
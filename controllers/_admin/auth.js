/**
 * Created by gerasimovnv on 22.07.2014.
 */

var updateLink = require('../../models/user').updateLink;

module.exports = {
    valid: false,
    auth: updateLink,
    action:function(req, def) {
        console.log(1);
        console.log(def);
        req.userId ? def.resolve({address:'/admin'}) : def.resolve({address:'admin/authorization', data: {}});

        return def.promise;
    }
};
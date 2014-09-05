/**
 * Created by gerasimovnv on 22.07.2014.
 */

var Admin = require('../../models/admin');

module.exports = {
    valid: false,
    auth: false,
    action: function(req, def){
        Admin.exit(req)
            .then(function(){
                def.resolve({address:'/admin/auth'});
            });
        return def.promise;
    }
};
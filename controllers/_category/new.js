/**
 * Created by gerasimovnv on 22.07.2014.
 */

var updateLink = require('../../models/admin').updateLink;

module.exports = {
    valid: false,
    auth: updateLink,
    action: function(req, def){
        if(req.userGroup!=2 || !req.userGroup) def.reject({code:404})
        def.resolve({address:'category/new-category', data:{userGroup: link.userGroup}});
        return def.promise;
    }
};
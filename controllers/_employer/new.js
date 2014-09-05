/**
 * Created by gerasimovnv on 21.07.2014.
 */
var Employer = require('../../models/employer');

module.exports = {
    valid: false,
    auth: Employer.updateLink,
    action:function(req, def){
        req.userId ? def.resolve({address:'/cabinet'}) : def.resolve({address:'employer/new-employer', data:{}});
        return def.promise;
    }
};
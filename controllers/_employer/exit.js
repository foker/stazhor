/**
 * Created by gerasimovnv on 21.07.2014.
 */
var Employer = require('../../models/employer');

module.exports = {
    valid: false,
    auth: Employer.updateLink,
    action: function(req, def){
        Employer.exit(req)
            .then(function(){
                def.resolve({address:'/auth'});
            });

        return def.promise;
    }
};
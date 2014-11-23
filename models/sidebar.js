var City = require('./city')
	, Category = require('./category')
	, Q = require('q');
	
exports.getData = function(){
	var def = Q.defer();
    console.log('sidebar');
	var list = City.list();
	Category.getTree(0, false)
    .then(function(cats){
        console.log(234234234);
        return def.resolve({cities: list.result, cats: cats.result});
    })
    .catch(function(err){
        console.log(err);
        return def.reject(err);
    });
	return def.promise;
};
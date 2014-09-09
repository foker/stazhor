var conf = require('../config')
  , Http = require('http')
  , Q = require('q')
  , City = require('./city')
  , async = require('async');

var validateExt = function(defaults, ext){
    if(ext){
        if(ext.keys && typeof(ext.keys) == 'string') defaults.keys = ext.keys.split(' ');
        if(ext.city && !isNaN(parseInt(ext.city)) ) defaults.city = ext.city;
        if(ext.salaryfrom && !isNaN(parseInt(ext.salaryfrom)) && parseInt(ext.salaryfrom)>=0) defaults.salaryfrom = parseInt(ext.salaryfrom);
        if(ext.salaryto && !isNaN(parseInt(ext.salaryto)) && parseInt(ext.salaryto)>=0) defaults.salaryto = parseInt(ext.salaryto);
        if(ext.category && !isNaN(parseInt(ext.category)) && parseInt(ext.category)>=0 && parseInt(ext.category)<=16) defaults.category = parseInt(ext.category);

        /*если зарплата "от" больше зарплаты "до"*/
        if(defaults.salaryfrom && defaults.salaryto && defaults.salaryfrom > defaults.salaryto){
            defaults.salaryfrom = defaults.salaryfrom + defaults.salaryto;
            defaults.salaryto = defaults.salaryfrom - defaults.salaryto;
            defaults.salaryfrom = defaults.salaryfrom - defaults.salaryto;
        }
    }
    return defaults;
};

//обработка информации
exports.treat = function(list){
	var def = Q.defer();
    list = JSON.parse(list);
	var posts = [];
	if(list && list.hits && list.hits.hits){
	    async.each(list.hits.hits,
        function(item, next){
            var el = item._source;
            City.getTitle(el.city)
            .then(function(result){
                el.city = result.result;
                posts.push(el);
                next();
            }, function(err){
                next(err);
            });
        },
        function(err){
            if(err) def.reject(err);
            def.resolve({posts: posts, total: list.hits.total});
        });
    } else def.resolve([]);
	return def.promise;
};

exports.getList = function(ext){
	var def = Q.defer();
    var Search = this;
	var reqData = {
		hostname:'localhost', 
		port:9200, 
		path:'/test/post/_search', 
		method: 'POST'
	};
	

    var qObj = {

    };
	if (ext.s!=undefined) qObj.query = {
		query_string : {
			query : ext.s
		}
	};
    if(ext.isActive!=undefined || ext.cat!=undefined || ext.employerId!=undefined) qObj.filter = {
        term: {}
    };

    if (ext.isActive!=undefined) qObj.filter.term.isActive = ext.isActive;
    if (ext.cat!==undefined && ext.cat!=='') qObj.filter.term.category = ext.cat;
    if (ext.employerId!=undefined) qObj.filter.term.employerId = ext.cat;

    var query = {
        sort: "date",
        query: {
            filtered : qObj
        }
    };

	if(!!ext.from) query.from = (ext.from-1)*10;


	var request = Http.request(reqData, function(result){
		var data = '';
        console.log(23);
		result.on('data', function (chunk) {
            console.log(25);
			return data = data+chunk;
		});
		result.on('end', function(){
			return Search.treat(data)
                .then(function(data){
                    console.log(3);
                    def.resolve(data);
                }, function(err){
                    def.reject(err);
                });
		});
	}).on('error', function(err) {
		def.reject(err);
	});
	request.write(JSON.stringify(query));
	request.end();
	return def.promise;
};
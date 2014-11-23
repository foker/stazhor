var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , User = require('./user')
  , Counters = require('./counters')
  , Post = require('./post')
  , async = require('async')
  , Q = require('q')
    , cities = require('./cities.js').cities
    , _ = require('underscore');
  
var City = new Schema({
	id: {
		type: Number,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	country: {
		type:Number,
		required: true
	}
});

City.methods = {
    cryptoPas: User.cryptoPas,
    checkPassword: User.checkPassword,
	make: function(password){
        var admin = this;
		var def = Q.defer();
        admin.salt = Math.random() + '';
        admin.hashedPassword = admin.cryptoPas(password);
		admin.group = 0;
		Counters.getNext('employer')
		.then(function(id){
			admin.id = id;
			return admin.save(function(err){
			    if(err) return def.reject({code:err});
			    return def.promise({id:admin.id});
			});
	    }, function(err){
			return def.reject(err);
		});
		return def.promise;
	}
};


City.statics = {
	addList: function(list){
		var def = Q.defer();
		var City = this;
		async.each(list, function(item, next){
			City.findOne({title: item}).exec()
			.then(function(result){
				if(result) return next();
				return Counters.getNext('city')
			}, function(err){
				return next(err);
			})
			.then(function(id){
				var city = new City({id:id, title: item, country:1});
				city.save(function(err){
					if(err) return next(err);
					return next(null, city);
				});
			}, function(){
				return next('counters');
			});	
		}, function(err ,collection){
			if(err) return def.reject({code:500, message:err});
			return def.resolve({result:collection});
		});
		return def.promise;
	},
	list: function(){
		/*var def = Q.defer();
		var City = this;
		City.find({}, 'title id').exec()
		.then(function(result){
			if(!result.length) return def.reject({code:'404', message:'cities not found'});
			return def.resolve({result:result});
		}, function(err){
			return def.reject({code:500, message:err});
		});
		return def.promise;*/
        console.log('cities');
        return {
            result: _.map(cities.cities, function (item, i) {
                return {
                    title: item,
                    id: i
                }
            })
        };
	},
	getTitle: function(id){
		var def = Q.defer();
		var City = this;
		City.findOne({id: id}, 'title').exec()
		.then(function(res){
            if(!res || typeof res.title == 'undefined') return def.resolve({code:404, message:'city title not found'});
			return def.resolve({result:res.title});
		}, function(err){
			def.reject({code:500, err: err});
		});
		return def.promise;
	}
};

module.exports = mongoose.model('City', City, 'City');
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , User = require('./user')
  , Counters = require('./counters')
  , Post = require('./post')
  , Redis = require('redis')
  , redisClient = Redis.createClient()
  , Q = require('q');
  
var Admin = new Schema({
	id: {
		type: Number,
		required: true
	},
	login: {
		type: String,
		required: true
	},
	group: {
		type:Number,
		required: true
	},
	salt: {
		type:String,
		required: true
	},
	hashedPassword: {
		type:String,
		required: true
	}
});

Admin.methods = {
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
			    if(err) return def.reject({code:500, msg:err});
			    return def.resolve({id:admin.id});
			});
	    }, function(err){
			return def.reject(err);
		});
		return def.promise;
	}
};


Admin.statics = {
    registration: User.registration,
    enter: User.enter,
    updateLink: User.updateLink,
    exit: User.exit,
	ban: function(id){
		var def = Q.defer();
		var banKey = 'ban'+id;
		redisClient.set([banKey, true, 'EX', 86400], function(err){
			if(err) return def.reject({code:500, message: err});
			return def.resolve();
		});
		return def.promise;
	},
	unBan: function(id){
		var def = Q.defer();
		var banKey = 'ban'+id;
		redisClient.del(banKey, function(err){
			if(err) return def.reject({code:500, message: err});
			return def.resolve();
		});
		return def.promise;
	}
};

module.exports = mongoose.model('Admin', Admin, 'Admin');
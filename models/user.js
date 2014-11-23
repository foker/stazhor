var Counters = require('./counters.js')
	, crypto = require('crypto')
	, async = require('async')
    , Redis = require('redis')
    , redisClient = Redis.createClient()
	, Q = require('q');

module.exports = {
    cryptoPas: function(password){
        var md5sum = crypto.createHash("md5");
        md5sum.update(password);
        return md5sum.digest("hex");
    },
    checkPassword: function (password) {
        return this.cryptoPas(password) === this.hashedPassword;
    },
    registration: function(req){
        var User = this;
		var def = Q.defer();
        User.findOne({login: req.login}).exec()
		.then(function(res){
            if(!!res) return def.reject({code:'notunique'});
            var user = new User(req);
                console.log(req.login);
            return user.make(req.pass);
        }, function(err){
			def.reject({code: 'db', message: err});
		})
            .then(function(){
                console.log(444);
                def.resolve();
            }, function(err){
                def.reject(err);
                console.log(err);
            });
		return def.promise;
    },
    enter: function(type, req){
        var User = this;
		var def = Q.defer();
        User.findOne({login: req.body.login}, 'hashedPassword id').exec()
		.then(function(res){
            if(!res) return def.reject({code:403, msg:'incorrect login or password'});
            var user = new User(res);
            if(!user.checkPassword(req.body.pass)) return def.reject({code:403, msg:'incorrect login or password'});
			var banKey = 'ban'+user.id;
			redisClient.get(banKey, function(err, res){
                if(err) return def.reject({code: 500, msg:err});
                if(res) return def.reject({code: 403, msg:err});
				req.session.userId = user.cryptoPas(user.id+'');
				return async.waterfall([
					function(next){
						return redisClient.hset([req.session.userId, 0, type], next);
					},
					function(res, next){
						return redisClient.hset([req.session.userId, 1, user.id], next);
					},
					function(res, next){
						return redisClient.expire(req.session.userId, 1000, next);
					}
				],
				function(err){
					if(err) return def.reject({code:500, message:err});
                    req.userId = user.id;
                    req.userGroup = type;
					return def.resolve();
				});
			});	                
        });
		return def.promise;
    },
    updateLink: function(req, def){
        if(req.session.userId == undefined) def.resolve();
        redisClient.hgetall(req.session.userId, function(err, res){
            if(err) return def.reject({code:500, msg: err});
            if(!res){
                req.session.userId = undefined;
                return def.resolve();
            }
			async.waterfall([
				function(next){
					return redisClient.hset([req.session.userId, 0, res[0]], next);
				},
				function(result, next){
					return redisClient.hset([req.session.userId, 1, res[1]], next);
				},
				function(result, next){
					return redisClient.expire(req.session.userId, 1000, next);
				}
			],
			function(err){
				if(err) return def.reject({code: 500, msg: err});
                req.userId = res[1];
                req.userGroup = res[0];
                return def.resolve();
			});
        });
		return def.promise;
    },
    exit: function(req){
		var def = Q.defer();
        redisClient.del(req.session.userId, function(){
            req.session.userId = undefined;
            return def.resolve();
        });
		return def.promise;
    }
};
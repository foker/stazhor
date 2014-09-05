var mongoose = require('mongoose')
    , Schema = mongoose.Schema
	, Q = require('q')
	, Counters = require('./counters')
	, _ = require('underscore');
	
var Numerator = new Schema({
	id: {
		type: Number,
		required: true
	},
	value: {
		type:Number,
		required: true
	},
	ips: {
		type: [],
		default: []
	}
});

Numerator.statics = {
	add: function(id){
		var def = Q.defer();
		var Numerator = this;
		var numer = new Numerator({id:id, value:0});
		numer.save(function(err){
			if(err) return def.reject(err);
			return def.resolve(id);
		});
		return def.promise;
	},
	inc: function(key, ip){
		var def = Q.defer();
		this.findOne({id: key}, 'value ips').exec()
		.then(function(res){
			if(!res) return def.reject({code:404});
			if(!res.ips || !res.ips.length || !_.contains(res.ips, ip)){
				res.ips.push(ip);
				return res.save(function(err, res){
					if(err) def.reject({code:500, msg: err});
					return def.resolve(res.ips.length);
				});
			} else return def.resolve(res.ips.length);
		}, function(err){
			return def.reject({code:500, message:err});
		})

		return def.promise;
	}
};

module.exports = mongoose.model('Numerator', Numerator, 'Numerator');
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , async = require('async')
	, Q = require('q');


var Counters = new Schema({
	_id: {
		type: String,
		required: true
	},
	seq: {
		type:Number,
		required: true
	}
});

Counters.statics.getNext = function(key){
	var def = Q.defer();
    this.findOneAndUpdate({_id: key}, {$inc: {'seq':1}}, {upsert: true}).exec()
	.then(function(res){
        if(!res) return def.reject({code:404});
        return def.resolve(res.seq);
    }, function(err){
		def.reject({code:500, message:err});
	});
	return def.promise;
};

module.exports = mongoose.model('Counters', Counters, 'Counters');
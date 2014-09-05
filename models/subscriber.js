var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Counters = require('./counters.js')
  , Redis = require('redis')
  , Post = require('./post.js');
  
var Subscriber = new Schema({
	id: {
		type: Number,
		required: true
	},
	isActive: {
		type: Boolean,
		required: true
	},
	mail: {
		type: String,
		required: true
	},
	cities: [Number],
	categories: [Number],
	frequency: {
		type:Number,
		required: true
	},
	vacancies: [Schema.Types.Mixed]
});

Subscriber.methods = {
	postMessage: function(){
		
	}
};

Subscriber.statics = {
	/*makeDelivery: function(cb){
		var Subscriber = this;
		Subscriber.aggregate({$match:{isActive:true}});
	}*/
};

module.exports = mongoose.model('Subscriber', Subscriber, 'Subscriber');
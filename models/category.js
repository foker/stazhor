var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Counters = require('./counters')
    , Post = require('./post.js')
	, Q = require('q');

var Category = new Schema({
    id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required:true
    },
    parent:{
        type:Number,
        required:true
    },
    isActive: {
        type:Boolean,
        required:true
    }
});

Category.methods = {

};

Category.statics = {
    newOne: function(title, parent){
        var Category = this;
		var def = Q.defer();
        Counters.getNext('category')
		.then(function(id){
            var category = new Category({title:title, parent:parent, id:id, isActive:true});
            return category.save(function(err){
                if(err) return def.reject({code:500, msg: err});
                return def.resolve({result:id});
            })
        }, function(err){
			return def.reject(err);
		});
		return def.promise;
    },
    getTree: function(parent,onlyChild){
        console.log('cat');
		var def = Q.defer();
        var Category = this;

        Category.find({}).exec()
		.then(function(res){
            //if(!res.length) return def.reject({code:404});
            return def.resolve({result:[]});
            var makeTree = function(result, collection, root, onlyChild, levelCounter, status){
				var levelCounter = (typeof levelCounter == 'undefined') ? 0 : levelCounter;
				levelCounter++;
				var delStatus = false;
				collection.forEach(function(item){
					var i = (typeof status != 'undefined') ? (status && item.isActive) : item.isActive;
					if(item.parent==root){
						if(onlyChild && !delStatus){
							result.pop();
							delStatus = true;
						}
						result.push({
							id:item.id,
							title: item.title,
							level: levelCounter,
							active: i
						});
						makeTree(result, collection, item.id, onlyChild, levelCounter, i);
					}
				});
                return result;
            };
            return def.resolve({result:makeTree([],res, parent, onlyChild)});
        }, function(err){
			return def.reject({code:500, message: err});
		});
		return def.promise;
    }
};

module.exports = mongoose.model('Category', Category, 'Category');
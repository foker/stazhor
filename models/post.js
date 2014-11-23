var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , elasticConf = {
	  	index: "test",
		typePost: "post" 
	}
	, async = require('async')
    , Http = require('http')
    , Counters = require('./counters')
    , Employer = require('./employer')
	, Q = require('q')
	, Numerator = require('./numerator');

//TODO: deleteOne проверить на работоспособность

var Post = new Schema({
    id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    desc: { 
        type: String,
        required: true
    },
    salary: {
        type: Number
    },
    city: {
        type: Number,
        required: true
    },
    phone: {
        type:String,
        required: true
    },
	category:{
		type: Number,
		required: true
	},
    company:{  // Inserting from employer's data
        type:String,
        required: true
    },
	employerId: { // Inserting from employer's data
		type: Number,
		required: true
	},
    site: {
        type:String
    },
    date: {
        type:Number,
        required:true
    },
	isActive: {
		type: Number, //Значение: - 0 - не просмотрено, 1- забанено, 2 - одобрено
		required: true,
		default: 0
	}
});

Post.methods = {
    fresh: function(){ //Обновление поста в базе и эластике
        var def = Q.defer();
        var post = this;
        post.save()
        .then(function(){
            post.index();
        }, function(err){
            def.reject({code:500, msg:err});
        })
        .then(function(){
            def.resolve();
        }, function(err){
            def.reject(err);
        });
    },
	saveAndIndex: function(req, over){   //при создании поста
		var post = this;
		var def = Q.defer();
        var write = function(id){
            var def = Q.defer();
            if(id) post.id = id;
            post.date = new Date().getTime();
            if(!req.userId)  def.reject({code:403, message: 'unauthorized users can not create posts'});
            post.employerId = req.userId;
            numerator.add(id)
            .then(function(){

                return Employer.findOne({id:post.employerId}, 'title').exec();
            }, function(err){
                return def.reject({code:500, message: err});
            })
            .then(function(res){
                if(!res) return def.reject({code:404});
                post.company = res.title;
                return post.save();
            })
            .then(function(){
                return post.index()
            }, function(err){
                return def.reject({code:500, message:err});
            })
            .then(function(){
                def.resolve();
            })
            .catch(function(err){
                def.reject(err);
            });
            return def.promise;
        };
		if(over){
			write()
                .then(function(){
                    def.resolve();
                }, function(err){
                    def.reject(err);
                });
		} else {
			Counters.getNext('post')
                .then(write)
                .then(function(){
                    def.resolve();
                }, function(err){
                    def.reject(err);
                })
                .catch(function(){
                    return def.reject(err);
                });
		}
		return def.promise;
	},
	index: function(deleting){
		var def = Q.defer();
		var putOptions = {
            hostname: 'localhost',
            port: 9200,
            path: '/'+elasticConf.index+'/'+elasticConf.typePost+'/'+this.id,
            method: deleting ? 'DELETE' : 'PUT'
        };
        var request = Http.request(putOptions, function(result){
			result.setEncoding('utf8');
            var data = '';
            result.on('data', function (chunk) {
                data=data+chunk;
            });
            result.on('end', function(){
                return def.resolve();
            });
			result.on('error', function(err){
				return def.resolve(err);
			});
		});
		if(!deleting) {
			var props = ['id', 'title', 'desc', 'date', 'salary', 'city', 'company', 'phone', 'site', 'employerId', 'isActive', 'category'];
			var post = {};
			for(key in props){
				post[props[key]] = this[props[key]];
			}
			request.write(JSON.stringify(post));
		}
		request.end();
		return def.promise;
	}
};

Post.statics = {

	deleteOne: function(postId, employerId){
		var def = Q.defer();
		var Post = this;
		Post.findOne({id: postId}, 'employerId id').exec()
		.then(function(res){
			if(!res) return def.resolve({code:404, msg:'post doesnt exist'});
			if(employerId!=res.employerId) return def.resolve({code:403, msg:'notauthor'});
			return res.remove(function(err){
                if(err) return def.reject({code:500, msg:err});
                post.index(true).then(function(){
                    return def.resolve();
                }, function(err){
                    return def.reject(err);
                });
            })
		}, function(err){
			return def.resolve({code:500, message:err});
		})
		return def.promise;
	},
    checkAuthor: function(postId, employerId){
		var def = Q.defer();
        this.findOne({id:postId}, 'employerId id title desc site salary category city company date phone').exec()
		.then(function(res){
            if(!res) return def.reject({code:404});
            if(res.employerId == employerId) return def.resolve({post:res});
			else return def.reject({code:403});
        }, function(err){
			return def.reject({code:500, message: err});
		});
		return def.promise;
    },
	getAuthorList: function(author){
		var Post = this;
		var def = Q.defer();
		Post.find({employerId: author}, 'title id salary city employerId date company isActive').exec()
		.then(function(result){
			return def.resolve({result: result});
        }, function(err){
			return def.reject({code:500, message:err});
		});
		return def.promise;
	},
	changeAuthor:function(req, id, newName){
		var Post = this;
		var def = Q.defer();
		Post.find({employerId:id}, 'title desc site phone mail city address id company').exec()
		.then(function(res){
            if(!res.length) return def.resolve();
            return async.each(res, function(item, next){
                item.company = newName;
                item.saveAndIndex(req, true)
				.then(function(data){
                    return next(null, data);
                }, function(err){
					return next(err);
				});
            },
            function(err){
				if(err) return def.reject(err);
				return def.resolve();
            });
        }, function(){
			return def.reject({code:500, message:err});
		});	
		return def.promise;
	},
	getPagination: function(url, last){
		var urls = url.split('/'),
            start = '',
			end = '/',
			page = false,
			pages = [];
		for(key in urls){
			if(page){
                if(urls[Number(key)-1] != 'page') end = end + urls[key];
            }
			else if(urls[key] == 'page') page = urls[Number(key)+1];
			else start = start+urls[key];
		}
		if(page === false){
            var halfs = url.split('?');
            start = halfs[0];
            if (start[start.length-1]!='/') start +='/';
            for(var i = 0; i++; i<halfs.length){
                end = end+halfs[i];
            }
		} else {
            if (start[start.length-1]!='/') start +='/';
		}
        start = start+'page/';
		var cur = Number(page);
		if(isNaN(cur)) return [];
		for(var i = cur-3; i<cur+4;i++){
			if(i>0 && i<=last) pages[i] = start+i+end;
		}
		return pages;
	},
	preDate: function(stamp){
		var date = new Date(stamp);
		var month = date.getMonth()+1;
		if(date.getMonth()<9) month = '0'+month;
		var year = date.getYear()-100;
		return  date.getDate()+'.'+month+'.'+year;
	},
	ban: function(id, unban){
		var def = Q.defer();
		var Post = this;
		Post.findOne({id:id}, 'id title desc date salary city company phone site employerId isActive _category').exec()
		.then(function(res){
			if(!!res){
                unban ? res.isActive = 2 : res.isActive = 1;
				return res.save(function(){
					return res.index()
                        .then(function(){
                            def.resolve();
                        })
                        .catch(function(err){
                            def.reject(err);
                        });
				})

			}
			return def.resolve();
		}, function(err){
			return def.reject({code:500, msg: err});
		});
        return def.promise;
	}
};

module.exports = mongoose.model('Post', Post, 'Post');


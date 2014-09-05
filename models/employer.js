var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , Counters = require('./counters.js')
    , User = require('./user.js')
	, Q = require('q')
	, Post = require('./post.js');
	
	
var Employer = new Schema({
	id: {
		type: Number,
		required: true
	},
	login: {          //mail address
		type: String,
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
	hashedPassword: {
		type: String,
		required: true
	},
	regDate: {
		type: Number,
		required: true
	},
    phone: {
        type: String,
    },
    mail: {
        type: String,
    },
    //Необязательные поля, они могут каждый раз заполняться вручную при создании вакансии или перезаполняться
	city: {
		type:Number
	},
	site: {
		type:String
	},
	address: {
		type: String
	},
	salt:{
		type: String,
		required:true
	}
});

Employer.methods = {
    cryptoPas: User.cryptoPas,
    checkPassword: User.checkPassword,
	make: function(password){
        var employer = this;
		var def = Q.defer();
		var time = new Date().getTime();
		employer.regDate = time;
        employer.salt = Math.random() + '';
        employer.hashedPassword = employer.cryptoPas(password);
        Counters.getNext('employer')
		.then(function(id){
			employer.id = id;
			return employer.save(function(err){
			    if(err) return def.reject({code:500, msg:'saving'});
			    return def.resolve({id:employer.id});
			});
	    }, function(err){
			return def.reject(err);
		});
		return def.promise;
	}
};

Employer.statics = {
    registration: User.registration,
    enter: User.enter,
	updateLink: User.updateLink,
	exit: User.exit,
    saveCard: function(req, id){
        var Employer = this;
		var def = Q.defer();
        Employer.findOne({id:id}, 'title desc site phone mail city address').exec()
		.then(function(result){
            if(!result) return def.reject({code:404});
            var changeAuthor = (req.body.title && req.body.title!=result.title);
            for(key in result){
                if(req.body[key]) result[key] = req.body[key];
            }
            return result.save(function(err){
                if(err) return def.reject({code:500, message:err});
                if(changeAuthor) return Post.changeAuthor(req, id, req.body.title)
                    .then(function(){
                        def.resolve();
                    }, function(err){
                        def.reject(err);
                    });
				return def.resolve();
            });
        }, function(err){
			return def.reject({code:500, message:err});
		});
		return def.promise;
    },
	getList: function(page){
		var def = Q.defer();
		var Employer = this;
		page = page || 1;
		var skip = (page - 1)*10 ;
		Employer.aggregate(
            [
                {
                    $project: {
                        login: 1,
                        title: 1,
                        id: 1,
                        regDate: 1,
                        _id:0
                    }
                },
                {$sort: {regDate: 1}},
                {$skip: skip},
                {$limit: 10}
		    ],
            function(err, data){
                if(err) return def.reject(err);
                return def.resolve(data);
            }
        );
		return def.promise;
	}
};

module.exports = mongoose.model('Employer', Employer, 'Employer');


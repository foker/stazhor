var Employer = require('../models/employer')
    , Counters = require('../models/counters')
	, Post = require('../models/post')
	, Q = require('q')
	, City = require('../models/city')
	, async = require('async');



/*params :
 *data - JSON, который нужно передать шаблону или отобразить, также включащий в себя флаг относительно JSON. Если это значение == false, то будет редирект
 *adress - название template, если будет рендеринг или адрес, по которому будет редиректиться
 *res - объекта ответа
 *code - код редиректа(необязательный)
 */
var rendering = function(data, address, res,  code){
    if(!data) return res.redirect(code||200, address);
    if(data.JSON) return res.send(data);
    return res.render(address, data);
};

exports.newEmp = function(req, res){
	Employer.updateLink(req)
	.then(function(){
		return res.redirect('/_cabinet');
	}, function(){
		return res.render('employer/new-employer');
	});
};

exports.createEmp = function(req, res){
	if(!req.body.login || !req.body.pass) return res.send({result:0, code: 'badreq'});
    return Employer.registration(req.body)
	.then(function(data){
        return res.send(data);
    }, function(data){
		return res.send(data);
	});
};

exports.auth = function(req, res){
    Employer.updateLink(req)
	.then(function(link){
		return res.redirect('/_cabinet');
	}, function(){
		return res.render('employer/authorization');
    });
};

exports.enter = function(req, res){
    if(!req.body.login || !req.body.pass) return res.send({code:'badreq'});
    return Employer.enter(1, req)
	.then(function(data){
		return Post.getAuthorList(data.result);
	}, function(err){
		res.send(err);
	})
	.then(function(data){
		return res.render('employer/_cabinet', {posts:data.result,userGroup:1, editable:true});
	}, function(){
		return res.send(err);
	})
};

exports.cabinet = function(req, res){
	Employer.updateLink(req)
	.then(function(link){
		if(link.userGroup==2) return res.redirect('/admin');
        return Post.getAuthorList(link.result);
	}, function(){
		return res.render('employer/authorization', {url: req.url});
	})
	.then(function(data){
        if(!data.result || !data.result.length) return res.render('employer/_cabinet', {posts: [], userGroup: 1, editable:true});
		var posts = [];
	    return async.each(data.result, function(item, next){
		    var post = {};
		    for(key in item){
				if(typeof item[key] != 'undefined') post[key] = item[key];
			}
			City.getTitle(item.city)
			.then(function(result){
				post.city = result.result;
				posts.push(post);
				next();
			}, function(err){
				next(err);
			});
		}, function(err){
			if(err) return res.send(JSON.stringify(err));
			return res.render('employer/_cabinet', {posts: posts, userGroup: 1, editable:true});
		});

	}, function(err){
		return res.send(err);
	});
};

exports.exit = function(req, res){
	Employer.exit(req.session.userId)
	.then(function(){
		res.redirect('auth');
	});
};

exports.showEmployer = function(req, res){
	Employer.updateLink(req)
	.then(function(link){
		if(!req.param('id')) return res.send({code:'badreq'});
		return [Employer.findOne({id:req.param('id')}, 'title desc').exec(), link];
	},function(){
		return [Employer.findOne({id:req.param('id')}, 'title desc').exec(), link];
	})
	.spread(function(result, link){
		if(!result) return res.send({code:404});
		return res.render('employer/employer',{employer:result, userGroup: link.userGroup});
	}, function(err){
		return res.send({code:'db', message: err});
	});
};

exports.cardEdit = function(req, res){
	Employer.updateLink(req)
	.then(function(link){
		if(link.userGroup!=1) return res.redirect(404,'/error');
		return [Employer.findOne({id:link.result},'title desc site phone mail city address').exec(), link];
	}, function(){
		return res.redirect(404,'/error');
	})
	.spread(function(result, link){
		if(!result) return res.send({code:404});
		return [City.list(), result, link];
	}, function(err){
		return res.send({code:'db', message: err});
	})
	.spread(function(list, result, link){
		return res.render('employer/edit-card', {card:result,userGroup:link.userGroup, cities: list.result});
	}, function(err){
		return res.send(err);
	});
};

exports.cardSave = function(req, res){
	Employer.updateLink(req)
	.then(function(link){
		if(!req.body.title || !req.body.desc || (!req.body.phone && !req.body.mail)) return res.send({code:'badreq'});
		return [Employer.saveCard(req, link.result), link];
	}, function(link){
		if(!req.body.title || !req.body.desc || (!req.body.phone && !req.body.mail)) return res.send({code:'badreq'});
		return [Employer.saveCard(req, link.result), link];
	})
	.spread(function(result, link){		
		return [City.list(), result, link];
	}, function(err){
		return res.send(err);
	})
	.spread(function(list, result, link){
		if(!result.changeAuthor) return  res.render('employer/edit-card', {card:req.body,userGroup:link.userGroup, cities: list.result});
		return Post.changeAuthor(req, link.result, req.body.title)
		.then(function(result){
			return res.render('employer/edit-card', {card:req.body,userGroup:link.userGroup, cities: list.result});
		}, function(){
			return res.send(err);
		});
		
	}, function(err){
		console.log(3);
		return res.send(err);
	});
};
var Post = require('../models/post')
    , Counters = require('../models/counters')
	, Search = require('../models/search')
	, Employer = require('../models/employer')
	, Category = require('../models/category')
	, City = require('../models/city')
	, Numerator = require('../models/numerator')
	, async = require('async')
	, Q = require('q')
	, Sidebar = require('../models/sidebar');

/*params :
 *data - JSON, который нужно передать шаблону или отобразить, также включащий в себя флаг относительно JSON. Если это значение == false, то будет редирект
 *adress - название template, если будет рендеринг или адрес, по которому будет редиректиться
 *res - объекта ответа
 *code - код редиректа(необязательный)
 */
var rendering = function(res, data, address, code){
    if(!data) return res.redirect(code||200, address);
    if(data.JSON) return res.send(data);
    return res.render(address, data);
};

exports.newPost = function(req, res){
	Employer.updateLink(req)
	.then(function(link){
        return [Employer.findOne({id:link.result}, 'title site phone city').exec(), link];
	}, function(){
		return res.redirect('auth',{userGroup: 0});
	})
	.spread(function(empData, link){
        if(!empData) return res.redirect(404, '/error');
        return [Sidebar.getData(), link, empData];
    })
	.spread(function(Sidebar, link, empData){
		return res.render('vacancy/new-vacancy',{
			data:empData, 
			categories: Sidebar.cats, 
			userGroup:link.userGroup, 
			cities: Sidebar.cities
		});
	})
	.catch(function(err){
		return res.send(err);
	});
};


exports.readPost = function(req, res){
	Employer.updateLink(req)
	.both(function(link){
		return [Post.findOne({id: req.param('id')} , 'id title desc salary city company date phone').exec(), link];
	})
	.spread(function(result, link){
		return [Sidebar.getData(), result, link];
	})
	.spread(function(sidebar, result, link){
		if(!result) return res.redirect(404, '/error');
		return [Numerator.inc(req.param('id'), req.connection.remoteAddress), sidebar, result, link];
	}, function(err){
		return res.redirect(404, '/error');
	})
	.spread(function(num, sidebar, result, link){
		return [City.getTitle(result.city), num, sidebar, result, link];
	}, function(err){
		return res.send(err);
	})
	.spread(function(city, num, sidebar, result, link){
		var post = {};
		for(key in result){
			post[key] = result[key];
		}
		post.city = city.result;
		post.date = Post.preDate(post.date);
		return res.render('vacancy/vacancy',{
			post: post, 
			cats: sidebar.cats, 
			cities: sidebar.cities,
			city: city.result, 
			num: num, 
			id: req.param('id'), 
			userGroup: link.userGroup,
            moder: (link.userGroup==2)
		});
	}, function(err){
		return res.send(err);
	})
	.catch(function(err){
		res.send(err);
	});
};


exports.list = function(req, res){
	Employer.updateLink(req)
	.both(function(link){
		return [Search.getList({s: req.query.s, cat: req.query.s, isActive:2, from: req.param('page')||0}), link];
	})
	.spread(function(searchResult, link){
		return [Sidebar.getData(), searchResult, link];
	})
	.spread(function(sidebar, searchResult, link){
		var pages = Post.getPagination(req.url, 1+(searchResult.total/10>>0));
		return res.render('common/index', {
			posts: searchResult.posts,
			cats: sidebar.cats, 
			cities: sidebar.cities,
			userGroup: link.userGroup,
			editable:false, 
			total: searchResult.total,
			url: req.url, 
			pages:pages
		});
	})
	.catch(function(err){
		res.send(err);
	});
};

exports.editPost = function(req, res){
	Employer.updateLink(req)
	.both(function(link){
		return [Post.checkAuthor(req.param('id'), link.result), link];
	})
	.spread(function(postData, link){
		return [Sidebar.getData(), postData, link];
    })
	.spread(function(Sidebar, postData, link){
		return res.render('vacancy/edit',{post:postData.post, userGroup:link.userGroup, categories: Sidebar.cats, cities: Sidebar.cities});
	})
	.catch(function(err){
		res.send(err);
	});
};

//далее идут контроллеры с редиректом(то есть без рендеринга)

exports.savePost = function(req, res){
    Employer.updateLink(req)
	.then(function(link){
        return [Post.checkAuthor(req.param('id'), link.result), link];
    }, function(){
        return res.send({code:403});
    })
	.then(function(postData, link){
        return Post.findOne({id:req.param('id')}).exec();
    })
	.then(function(result){
        if(!result) return res.send({code:404});
        for(prop in req.body){
            if(result[prop]) result[prop] = req.body[prop];
        }
        return result.fresh();
    },function(err){
            return res.send({code:500, msg:err});
    })
	.then(function(){
        return res.redirect('/edit/'+req.param('id'));
    })
    .catch(function(err){
        return res.send(err);
    });
};

exports.sendDeletePost = function(req, res){
	Employer.updateLink(req)
	.then(function(link){
		return Post.deleteOne(req.param('id'), link.result);
    }, function(){
		return res.redirect('/auth');
	})
	.then(function(){
        return res.redirect('/_cabinet');
    }, function(err){
		return res.send(err);
	});
};

exports.createPost = function(req, res){
	if(!req.body.title || !req.body.category || !req.body.desc) return res.send({code: 'badreq'});
    var post = new Post(req.body);
	return post.saveAndIndex(req)
	.then(function(data){
		return res.redirect('/_cabinet');
	},function(err){
		return res.send(err);
	});
};

exports.getSidebar = function(req, res){
    Sidebar.getData()
        .then(function(data){
            data.JSON = true;
            rendering(res, data);
        }, function(err){
            data.JSON = true;
            rendering(res, data);
        });
};


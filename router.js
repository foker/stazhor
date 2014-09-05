var _post = require('./controllers/_post')
    , _admin = require('./controllers/_admin')
    , _employer = require('./controllers/_employer');

module.exports = function (app) {

	
	app.get('/new', _post.newPost);
	app.get('/edit/:id', _post.editPost);
	app.post('/save/:id', _post.savePost);
	app.post('/deletepost/:id', _post.sendDeletePost);
	app.post('/post', _post.createPost);
	app.get('/post/:id', _post.readPost);
	app.put('/post/:id', _post.savePost);
	app.delete('/post/:id', _post.sendDeletePost);
	app.get('/', _post.list);
	app.get('/page/:page', _post.list);

	
	app.get('/register', _employer.newEmp);
	app.post('/create-employer', _employer.createEmp);
    app.get('/auth', _employer.auth);
    app.post('/enter', _employer.enter);
	app.get('/employer/:id', _employer.showEmployer);
	app.get('/cabinet', _employer.cabinet);
	app.get('/exit', _employer.exit);
	app.get('/card/edit', _employer.cardEdit);
	app.post('/card/save', _employer.cardSave);

    app.get('/admin/register', _admin.newAdmin);
    app.post('/admin/create', _admin.createAdmin);
    app.get('/admin/auth', _admin.auth);
    app.post('/admin/enter', _admin.enter);
    app.get('/admin/exit', _admin.exit);
    app.get('/admin/categories', _admin.categories);
    app.get('/admin/categories/new', _admin.newCategory);
    app.post('/admin/categories/create', _admin.createCategory);
	app.post('/admin/categories/:id/switch', _admin.switchCategory);
    app.post('/admin/categories/:id/update', _admin.updateCategory);
    app.post('/admin/categories/:id/save', _admin.saveCategory);
	app.get('/admin/ban/:id', _admin.ban);
	app.get('/admin/unban/:id', _admin.unBan);
	app.get('/admin/banpost/:id', _admin.banPost);
    app.get('/admin/unbanpost/:id', _admin.unBanPost);
    app.get('/admin/posts/blacklist', _admin.blackList);
    app.get('/admin/posts/blacklist/page/:page', _admin.blackList);
    app.get('/admin/posts/whitelist', _admin.whiteList);
    app.get('/admin/posts/whitelist/page/:page', _admin.whiteList);
    app.get('/admin', _admin.unseenList);
    app.get('/admin/page/:page', _admin.unseenList);
	
	app.get('/admin/readCities', _admin.readCities);
	app.get('/admin/clear/elastic', _admin.clearElastic);
    app.get('/admin/clear/posts', _admin.clearPosts);

    app.get('/JSON/getSidebar', _post.getSidebar);
};

var express = require('express'),
    http = require('http'),
    app = express(),
    middleware = require('./middleware')(app, express),
    config = require('./config'),
	mongoose = require('mongoose');

var connect = function(){
	mongoose.connect(config.get('db:db'), config.get('db:options'));
	console.log('mangust connected');
};
connect();

mongoose.connection.on('disconnect', function(){
	connect();
});

mongoose.connection.on('error', function(err){
	console.log(err);
});
	
	
http.createServer(app).listen(config.get('port'), function(){
    console.log('Express server listening on port ' + config.get('port'));
});
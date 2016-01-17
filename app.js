var express = require('express'), 
	path  = require('path'),
	// bring the config file from config folder using config.js file
	config = require('./config/config.js'),
	// set up for knox( a s3 client for node)
	knox = require('knox'),
	fs = require('fs'),
	os = require('os'),
	formidable = require('formidable');
	
	
var app = express();

app.set('views', path.join(__dirname, 'views')); // name and path to the folder which stores the views, i.e .html files
app.engine('html', require('hogan-express')); // express should render html files and the method to use to render pages is hogan-express module
app.set('view engine', 'html'); // file extension for templates is html
app.set('host', config.host); // used for config, use development or production config based on the environment variables

app.use(express.static(path.join(__dirname, 'public'))); // for static files look in the public folder

// set the port
app.set('port', process.env.PORT || 3000);

// configure app for using knox client
var knoxclient = knox.createClient(
	{
		key: config.S3AccessKey,
		secret: config.S3SecretKey,
		bucket: config.S3BucketName
	}
)

// for routes, routes are moved into seperate routes folder
require('./routes/routes.js')(express, app, formidable, fs, os);

// configure socket.io for express framework
var server = require('http').Server(app);
var io = require('socket.io')(server);


//use server instead of app, as server wraps app around it. So use .listen method on the 'server' variable
//since we used app.set to set the port, we use app.get('port')
server.listen(app.get('port'), function(){
	console.log("PHOTOGRID running on port " + app.get('port'));
});
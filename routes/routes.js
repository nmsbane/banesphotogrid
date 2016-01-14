module.exports = function(express, app){
	// use the router middleware
	var router = express.Router();
	
	router.get('/', function(req, res, next){
		res.render('index', {});
	});
	
	// mount the router on the app, i.e, whenever the request comes, use router.
	app.use('/', router);
}
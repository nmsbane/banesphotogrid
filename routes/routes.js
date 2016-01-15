module.exports = function(express, app){
	// use the router middleware
	var router = express.Router();
	
	router.get('/', function(req, res, next){
		res.render('index', {'host': app.get('host')});
	});
	
	// to handle /upload view point
	router.post('/upload', function(req, res, next) {
		// manage file upload
	})
	
	// mount the router on the app, i.e, whenever the request comes, use router.
	app.use('/', router);
}
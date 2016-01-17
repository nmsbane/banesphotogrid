module.exports = function(express, app, formidable, fs, os, gm, knoxclient){
	// use the router middleware
	var router = express.Router();
	
	router.get('/', function(req, res, next){
		res.render('index', {'host': app.get('host')});
	});
	
	// to handle /upload view point
	router.post('/upload', function(req, res, next) {
		// manage file upload
		// function to randomly generate file names
		function generateFileName(filename){
			// regular expression to extract the file name and file extension
			var regExp = /(?:\.([^.]+))?$/;
			var extName = regExp.exec(filename)[1];
			
			var date = new Date().getTime(); // no.of ms, between 1st jan 1970 and now
			var charBank = "abcdefghijklmnopqrstuvwxyz";
			var fString = '';
			for(var i = 0; i < 14; i++){
				fString = fString + charBank[Math.round((Math.random()*26))];
			}
			return (fString + date + '.' + extName);
		}
		// create some variables to store the filename, tmp filepath and new file path
		var tmpFile, nFile, fName;
		// creates a new incoming form
		var form = new formidable.IncomingForm();
		// to preserve the extensions of the files being received
		form.keepExtensions = true;
		// store the filenames to be used later, in the 'end' event
		form.parse(req, function(err, fields, files) {
			tmpFile = files.upload.path;
			// to create a new file name to be stored in s3 bucket
			fName = generateFileName(files.upload.name); // files.upload.name contains the name of the file uploaded ex: 'node.jpg'
			// path to temp directory where the file is stored
			nFile = os.tmpDir() + '/' + fName;
			res.writeHead(200, {"Content-Type": 'text/plain'});
			res.end();
		});
		// the file has been parsed, and we have to rename the file path from tmpFile to fName using 'fs' module
		form.on('end', function(){
			fs.rename(tmpFile, nFile, function(){
				// resize the image and upload the file into the s3 bucket
				// resize it to 450px and write it to the location pointed at nFile
				gm(nFile).resize(450).write(nFile, function(){
					// upload the overwritten file to s3
					// read the file 
					fs.readFile(nFile, function(err, buf){
						var req = knoxclient.put(fname, {
							'Content-Length': buf.length,
							'Content-Type': 'image/jpeg'
						});
						
						// listen for response event on 'req' 
						req.on('response', function(res){
							// if file is successfully put on the s3 bucket
							if(res.statusCode == 200) {
								
							}
						});
						
						// end the request
						req.end(buf);
					});
				});
			});
		});
	})
	
	// mount the router on the app, i.e, whenever the request comes, use router.
	app.use('/', router);
}
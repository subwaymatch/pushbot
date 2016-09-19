var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var exec = require('child_process').exec;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('PushBot is running...');
});
	
var executeCommands = function(cmdArr, runIndex, callback) {
	if (runIndex >= cmdArr.length) {
	    callback();
	    return;
	}
	
	exec(cmdArr[runIndex], {
	    'cwd': '/var/www/dashhour/'
	}, function(err, stdout, stderr) {
	    console.log('exec(' + cmdArr[runIndex] + ')');
	    executeCommands(cmdArr, runIndex + 1, callback);
	});
};

app.post('/api/v1/push', function(req, res) {
	console.log('Git push event detected');
	
	// console.log(req.body);
	
	var cmdArr = [
		'git fetch origin master',
		'git reset --hard FETCH_HEAD',
		'git clean -df',
		'pm2 restart index.js'
	];
	
	executeCommands(cmdArr, 0, function() {
		console.log('Executing commands complete');
	});
});

app.listen(3000, function() {
	console.log('PushBot listening on port 3000');
});

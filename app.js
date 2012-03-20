//var cheerio = require('cheerio');
var _ = require('underscore');
var parser = require('blindparser');
var api_request = require('api_request');
var express = require('express');
var app = express.createServer();
var util = require('util');
var fs = require('fs');

app.set('view engine', 'jade');
app.set('view options', {
  layout: false
});

app.use(express.static(__dirname + '/public'));
app.use('/core', express.static(__dirname + '/core'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/js', express.static(__dirname + '/js'));

app.get('/', function(req, res){
	res.writeHead(200, {'content-type': 'text/html'});
	var rs = fs.createReadStream('index.html');
	util.pump(rs, res);
});

app.get('/redminator', function(req, res) {
	res.render('redminator');
});

function list(res) {
    parser.parseURL('http://redmine.e-soft.si/activity.atom?key=c122a258dbafaaf2f957a7eabfc4ba3ad45e98cf', {}, function(err, out){
		console.log('got osmething');
		res.json(out.items);
	});
}

app.get('/redmine/:operation?/:id?', function(req, res) {
	var op = (req.params.operation === undefined) ? 'list' : req.params.operation;
	console.log("id:" + req.params.id);
	console.log("op:" + op);
	console.log('starting request');
    if (op === 'list') {
        list(res);
        return;
    }
	/*var r = new api_request('http', 'redmine.e-soft.si');
	r.get('/activity.atom?key=c122a258dbafaaf2f957a7eabfc4ba3ad45e98cf')
	.on('reply', function(reply){
		console.log('got reply');
		//res.json(reply.items);
		res.send("123");
	});*/
});

app.get('/gohome', function (req, res) {
	var r = new api_request('http', 'www.gohome.si');
	r.get('/Search.aspx?q=stanovanje+%C5%A1kofja+loka+najnovej%C5%A1e')
    .on('reply', function(reply) {
      $ = cheerio.load(reply);
	  var gohomeResult = _.map($('.JQResult.item', '#results'), function(num) {return num.attribs;});
	  console.log(gohomeResult.length);
	  res.json({items : gohomeResult});
    });
});

app.listen(3000);
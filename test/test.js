//Using this as a guide:
//http://brianstoner.com/blog/testing-in-nodejs-with-mocha/

//Import our modules here
var request = require('request'),
	//server = require('../lib/server.js'),
	server = require('http-server'),
	fs = require('fs'),
	assert = require('chai').assert,
	expect = require('chai').expect;

var url = 'http://127.0.0.1:8000/app';
var index = fs.readFileSync('app/index.html');

//start our testing
describe('Datto Project', function(){
	//setup the server before any test
	before(function(done){
		server.createServer(function(req, res){
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end(index);
		}).listen(8000);
		done();
	})
	after(function(done){
		//server.closeServer();
		done();
	})
	//test connection to the server. response should be 200
	describe('GET /', function(){
		it('returns status code 200', function(done){
			request.get(url, function(err, res, body){
				console.log(url);
				//console.log(res);
				assert.equal(200, res.statusCode);
				done();
			});
		})
	})
	//Let's test the menu var needed to populate the compenents
	describe('Menu object variable', function(){
		/* Example from online
		function add() {
		  return Array.prototype.slice.call(arguments).reduce(function(prev, curr) {
		    return prev + curr;
		  }, 0);
		}
		var tests = [
		    {args: [1, 2],       expected: 3},
		    {args: [1, 2, 3],    expected: 6},
		    {args: [1, 2, 3, 4], expected: 10}
		  ];

		  tests.forEach(function(test) {
		    it('correctly adds ' + test.args.length + ' args', function() {
		      var res = add.apply(null, test.args);
		      assert.equal(res, test.expected);
		    });
		  });
		*/
		var menu = {
			'front_end': [{
				'name': 'HTML'
			},{
				'name': 'JS'
			},{
				'name': 'CSS',
				'more_options': [{
					'name': 'Pre Processors',
					'tags': ['LESS', 'SASS']
				},{
					'name': 'Post Processors',
					'tags': ['PostCSS']
				}]
			}],'back_end': [{
				'name': 'PHP'
			},{
				'name': 'Ruby'
			},{
				'name': 'Groovy'
			}]
		}
		//keys should be an array to work
		it('front_end should return an array', function(done){
			assert(Array.isArray(menu['front_end']));
			done();
		})
		it('back_end should return an array', function(done){
			assert(Array.isArray(menu['back_end']));
			done();
		})
		
		//name key should exist within array
		it('front_end array should contain object with name attribute', function(done){
			assert.isObject(menu['front_end'][0], 'front_end key is an object');
			done();
		})
		it('back_end array should contain object with name attribute', function(done){
			assert.isObject(menu['back_end'][0], 'front_end key is an object');
			done();
		})
	})
})

//In a parallel universe, I would've liked to implemented this:
//https://sean.is/writing/client-side-testing-with-mocha-and-karma/
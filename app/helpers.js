var http = require("http");
var url = require("url");
var query = require("querystring");
require('es6-promise').polyfill();

var KreativeRequest = function(){

}

KreativeRequest.prototype.request = function request(href, method, body, context){
	var self = context;
	var promise = new Promise(function(resolve, reject){

		var options = {
			host: url.parse(href).host,
			path: url.parse(href).path,
			method: method || 'GET',
			headers: {
				'Content-type': 'application/json',
				'Content-length': body ? body.length : 0
			}
		}

		var req = http.request(options, function(res){
			var chunks = '';

			res.setEncoding('utf8');
			res.on('data', function(chunk){
				chunks += chunk.toString();
			})

			res.on('end', function(){
				if(chunks){
					resolve(chunks);
				}
			})
		});


		req.on("error", function(error){
			reject(error);
		})

		if( body ){
			req.write(body);
		}

		req.end();
	})

	return promise;
}

KreativeRequest.prototype.get = function get(options){
	var self = this;
	self.request(options.endpoint, "GET", options.data, options.context)
		.then(function(result){
			options.success(result)
		}, function(error){
			options.error(error);
		})
}

KreativeRequest.prototype.post = function post(options){
	var self = this;
	self.request(options.endpoint, "POST", options.data, options.context)
		.then(function(result){
			options.success(result)
		}, function(error){
			options.error(error);
		})
}

module.exports = new KreativeRequest();
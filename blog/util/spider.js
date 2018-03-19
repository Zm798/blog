// 1.引入模块
var request = require('request'),
	cheerio = require('cheerio');	

exports.get = function(url){
	return new Promise(function(resolve,reject){
		// 2.偷数据
		request(url, function(err,response,body){
			if (err) {
				reject(err);
			} else {
				var $ = cheerio.load(body);

				resolve($);
			}
		})
	})
}

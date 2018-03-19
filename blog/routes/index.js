var express = require('express');
var router = express.Router();

// 引入type模型
var Type = require('../util/model.js').Type;
var Content = require('../util/model.js').Content;

router.get('/', function(req, res, next) {
	// 查找分类名
	Type.find(function(err,types) {
		if(err) {
			next(err);
		} else {
			// 没有条件,默认第一个内容
			var tid = req.query.tid ? req.query.tid : types[0]._id; 
			// 查找分类对应的文章
			Content.find({type:tid},function(err,articles) {
				if(err) {
					next(err);
				} else {
					var article = {};
					var moment = require('moment')
					for(var i = 0; i < articles.length; i++) {
						if(articles[i]._id == req.query.aid) {
							article = articles[i];
							break;
						} else {
							article = articles[0];
						}
					}
					res.render('index',{tid:tid,types:types,articles:articles,article:article,moment:moment})
				}
			}) 
		}
	}) 

});

module.exports = router;



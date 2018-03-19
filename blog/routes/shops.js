var express = require('express');
var router = express.Router();

var Shop = require('../util/model.js').Shop;

// 商品首页
router.get('/shops', function(req,res,next){
	Shop.count(function(err,total) {
		// 分页
		var page = {};
		page.every = 5;
		// 总页数
		page.totalPage = Math.ceil(total / page.every);
		//当前页码
		page.nowPage = Number(req.query.page ? req.query.page : 1);
		// 上一页
		page.prevPage = page.nowPage - 1 <= 1 ? 1 : page.nowPage - 1;
		// 下一页
		page.nextPage = page.nowPage + 1 >= page.totalPage ? page.totalPage : page.nowPage + 1;
		// 查找
		Shop.find(function(err,shops){
			if (err) {
				next(err);
			} else {
				console.log(shops)
				res.render('shops/index',{shops:shops,page:page});
			}
		}).limit(page.every).skip((page.nowPage-1)*page.every);
	})
})

router.get('/shops/collect', function(req,res,next){
	// 引入采集模块
	var spider = require('../util/spider.js');

	spider.get('http://www.meishij.net/chufang/diy/guowaicaipu1/').then(function($){
		$('.listtyle1').each(function(){
			var obj = {};
			// a链接的title获取
			obj.title = $(this).find('.big').attr('title');
			// 图片地址
			obj.image = $(this).find('.big').children('img').attr('src');
			obj.evaluate = $(this).find('.big').find('.c1').children('span').text();
			obj.author = $(this).find('.big').find('.c1').children('em').text();

			// console.log(obj)

			Shop.create(obj, function(err){
				if (err) {
					console.log('失败了');
				} else {
					console.log('成功了');
				}
			})
		})
	})
})
router.get('/shops/remove/:_id',function(req,res,next){
	Shop.remove(req.params,function(err,shops){
		if(err) {
			next(err);
		} else {
			res.redirect('/shops');
		}
	})
})
module.exports = router;

var express = require('express');
var router = express.Router();

// 引入type模型
var Content = require('../util/model.js').Content;
var Type = require('../util/model.js').Type;

// 文章首页
router.get('/contents', function(req, res, next) {
	var where = {};
	if(req.query.articlename) {
		where.articlename = new RegExp(req.query.articlename);
	}
	// 搜索+分页
	var str = '';
	for (var i in req.query) {
		// 排除page这个参数，因为在expres中，多个重名的参数，会形成数组
		if (i != 'page') {
			str += i+'='+req.query[i]+'&';
		}
	}
	// 获取数据的总数量
	Content.count(function(err,total) {
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
		Content.find(function(err,contents) {
			if(err) {
				console.log('查找失败,失败的原因:',err.message);
				next(err);
			} else {
				console.log('查找成功');
				var moment = require('moment');
				res.render('contents',{contents:contents,moment:moment,page:page,query:req.query,str:str});
			}
		}).populate('type').where(where).limit(page.every).skip((page.nowPage-1)*page.every);
	}).where(where);
})

// 提供一个添加分类的页面
router.get('/contents/create', function(req, res, next) {
	console.log(req.body);
	// 查询分类信息
	Type.find(req.body,function(err,types) {
		if(err) {
			next(err);
		} else {
			console.log('ok',types);
			res.render('contents/create',{types:types});
		}
	})
	
})
// 接收添加的文章
router.post('/contents/create',function(req,res,next) {
	// console.log(4444444444,req.body)
	Content.create(req.body,function(err,contents) {
		if(err) {
			console.log('添加失败,失败的原因:',err.message);
			next(err);
		} else {
			console.log('添加成功',contents);
			res.redirect('/contents');
		}
	})
})

// 删除
router.get('/contents/remove/:_id',function(req,res,next) {
	Content.remove(req.params, function(err){
		if(err) {
			console.log('删除失败,失败的原因:',err.message);
			next(err);
		} else {
			console.log('删除成功');
			res.redirect('/contents');
		}
	})
})

// 点击修改按钮,跳转到修改页面
router.get('/contents/update/:_id',function(req,res,next) {
	Content.findOne(req.params,function(err,content) {
		if(err) {
			console.log('查找失败,失败的原因:',err.message);
			next(err);
		} else {
			// 修改信息时,需默认分类信息
			Type.find(function(err,types) {
				if(err) {
					next(err);
				} else {
					console.log('查找成功',types);
					res.render('contents/update',{content:content,types:types});
				}
			})
		}
	})
})

// 修改数据并提交给服务器
router.post('/contents/update',function(req,res,next) {
		//console.log(111,req.body)

	Content.update({_id:req.body._id},req.body,function(err) {
		if(err) {
			console.log('修改失败,失败的原因:',err.message);
			next(err);
		} else {
			console.log('修改成功');
			res.redirect('/contents');
		}
	})
})
module.exports = router;

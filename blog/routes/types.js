var express = require('express');
var router = express.Router();

// 引入type模型
var Type = require('../util/model.js').Type;

// 提供一个分类首页
router.get('/types', function(req, res, next) {
	// 获取数据的总数量
	Type.count(function(err,total) {
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
		Type.find(function(err,types) {
			if(err) {
				console.log('查找失败,失败的原因:',err.message);
				next(err);
			} else {
				console.log('查找成功');
				var moment = require('moment');
				res.render('types',{types:types,moment:moment,page:page});
			}
		}).limit(page.every).skip((page.nowPage-1)*page.every);
	})
})
// 提供一个添加分类的页面
router.get('/types/create', function(req, res, next) {
	res.render('types/create');
})
// 接收添加的分类
router.post('/types/create',function(req,res,next) {
	Type.create(req.body,function(err,types) {
		if(err) {
			console.log('添加失败,失败的原因:',err.message);
			next(err);
		} else {
			console.log('添加成功',types);
			res.redirect('/types');
		}
	})
})

// 删除
router.get('/types/remove/:_id',function(req,res,next) {
	Type.remove(req.params, function(err){
		if(err) {
			console.log('删除失败,失败的原因:',err.message);
			next(err);
		} else {
			console.log('删除成功');
			res.redirect('/types');
		}
	})
})

// 点击修改按钮,跳转到修改页面
router.get('/types/update/:_id',function(req,res,next) {
	Type.findOne(req.params,function(err,type) {
		if(err) {
			console.log('查找失败,失败的原因:',err.message);
			next(err);
		} else {
			console.log('查找成功');
			res.render('types/update',{type:type});
		}
	})
})

// 修改数据并提交给服务器
router.post('/types/update',function(req,res,next) {
	Type.update({_id:req.body._id},req.body,function(err) {
		if(err) {
			console.log('修改失败,失败的原因:',err.message);
			next(err);
		} else {
			console.log('修改成功');
			res.redirect('/types');
		}
	})
})
module.exports = router;
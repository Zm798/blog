var express = require('express');
var router = express.Router();

// 引入User模型
var User = require('../util/model.js').User

// 用户首页
router.get('/', function(req, res, next) {
	var where = {};
	// 用户名
	if(req.query.username) {
		where.username = new RegExp(req.query.username);
	}
	// 时间
	if(req.query.minage && req.query.maxage) {
		where.age = {$lt: req.query.maxage, $gt: req.query.minage}
	}

	// 搜索分页：必须将条件和页面结合在一起
	var str = '';
	for (var i in req.query) {
		// 排除page这个参数，因为在expres中，多个重名的参数，会形成数组
		if (i != 'page') {
			str += i+'='+req.query[i]+'&';
		}
	}
	// 获取数据的总数量
	User.count(function(err,total) {
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
		User.find(function(err,users) {
			if(err) {
				console.log('查找失败,失败的原因:',err.message);
				next(err);
			} else {
				var sex = ['男','女'];
				var place = ['北京市','天津市','辽宁省','山西省','四川省'];
				console.log('查找成功',users);
				var moment = require('moment');
				res.render('users',{str:str,users:users,moment:moment,sex:sex,place:place,page:page,query:req.query});
			}
		}).where(where).limit(page.every).skip((page.nowPage-1)*page.every);
	}).where(where);
	
  	
});

// 给用户提供一个表单页面
router.get('/create',function(req,res,next) {

	res.render('users/create');
})

// 添加用户信息
// 1. 接受用户信息
router.post('/create',function(req,res,next) {
	// 密码加密
	var util = require('../util/md5.js');
	console.log(req.body.password);
	req.body.password = util.md5(req.body.password);
	// 添加数据
	User.create(req.body,function(err,users) {
		if(err) {
			console.log('添加失败,失败的原因:',err.message);
			next(err);
		} else {
			console.log('添加成功',users);
			res.redirect('/users');
		}
	})
})

// 删除数据
router.get('/remove/:_id',function(req,res,next) {
	User.remove(req.params, function(err){
		if(err) {
			console.log('删除失败,失败的原因:',err.message);
			next(err);
		} else {
			console.log('删除成功');
			res.redirect('/users');
		}
	})
})

// 点击修改按钮,跳转到修改页面
router.get('/update/:_id',function(req,res,next) {
	User.findOne(req.params,function(err,user) {
		if(err) {
			console.log('查找失败,失败的原因:',err.message);
			next(err);
		} else {
			console.log('查找成功');
			res.render('users/update',{user:user});
		}
	})
})

// 修改数据并提交给服务器
router.post('/update',function(req,res,next) {
	User.update({_id:req.body._id},req.body,function(err) {
		if(err) {
			console.log('修改失败,失败的原因:',err.message);
			next(err);
		} else {
			console.log('修改成功');
			res.redirect('/users');
		}
	})
})

// 点击设置头像按钮,跳转修改头像页面

  router.get('/avatar/:_id', function(req,res,next){
	User.findOne(req.params, function(err,user){
		if(err) {
			console.log('查找失败,失败的原因:',err.message);
			next(err);
		} else {
			console.log('查找成功',user);
			res.render('users/avatar',{user:user});
		}
	})
})

// 设置头像提交给服务器
router.post('/avatar', function(req,res,next){
	// 引入上传头像的文件
	//public\\uploads\\upload_040c0bace3c177e54d6d5bb4add874fa.jpg
	var util = require('../util/upload');
	util.upload(req, './public/uploads').then(function(data) {
		User.update(data.fields,{avatar:data.files.avatar.path.slice(6).replace(/\\/g,'/')},function(err){
			if(err) {
			console.log('修改失败,失败的原因:',err.message);
			next(err);
		} else {
			console.log('修改成功');
			res.redirect('/users');
		}
		})
	})

})

module.exports = router;
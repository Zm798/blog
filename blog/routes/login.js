var express = require('express');
var router = express.Router();

// 引入User模型
var User = require('../util/model.js').User;

// 提供一个登录页面
router.get('/login', function(req, res, next) {
  	res.render('login');
});

// 接受登录信息,并查找用户是否存在
router.post('/login',function(req,res,next) {
	// 密码加密
	var util = require('../util/md5.js');
	req.body.password = util.md5(req.body.password);
	User.findOne(req.body,function(err,user) {
		if(err) {
			next(err)
		} else {
			if(user) {
				console.log('查找成功');
				req.session.admin = user;
				res.redirect('/users');
			} else {
				console.log('查找无结果,密码或者账号错误');
				res.redirect('back');
			}
		}
	})
})

// 退出
router.get('/logout',function(req,res,next) {
	//清空cookie
	req.session.admin = null;
	res.redirect('/');
})

// 注册
router.get('/reg',function(req,res,next) {
	res.render('reg');
})
router.post('/reg',function(req,res,next) {
	User.create(req.body,function(err) {
		if(err) {
			next(err);
		} else {
			res.redirect('/');
		}
	})
})

//判断用户名是否存在
router.post('/checkUser',function(req,res,next) {
	// 查找数据库
	User.findOne(req.body, function(err,user){
		if (err) {
			res.json({error:"服务器错误了"});
		} else {
			if (user) {
				// 查询到数据,用户已经注册
				res.json({success:1});
			} else {
				// 查询不到数据，用户还没有注册
				res.json({success:0});
			}
		}
	})
})

// 接收用户的手机号码，并且发送短信
router.post('/send', function(req, res, next) {
    // 接收手机号码并发送短信
    var phone = req.body.phone;

    // 获取随机的验证码
    function rand(m, n) {
        return Math.floor(Math.random() * (n - m + 1) + m)
    }
    var code = rand(1000, 9999);
    req.session.code = code;

    // 引入阿里大于提供的短信发送代码
    var TopClient = require('../util/msg/topClient.js').TopClient;

    var client = new TopClient({
        'appkey': '23341634',
        'appsecret': '7e30a1c2c254c9a109f283067e8d5e18',
        'REST_URL': 'http://gw.api.taobao.com/router/rest'
    });

    // 执行短信发送
    client.execute('alibaba.aliqin.fc.sms.num.send', {
            'extend': '123456',
            'sms_type': 'normal',
            'sms_free_sign_name': '俊哥技术小站',
            'sms_param': '{\"code\":\"' + code + '\"}',
            'rec_num': phone,
            'sms_template_code': 'SMS_105890028'
        },
        function(error, response) {
            if (error) {
                // 发送失败
                res.json({
                    success: 0
                })
            } else {
                // 发送成功
                res.json({
                    success: 1
                });
            }
        })
})

module.exports = router;



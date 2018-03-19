// 接收手机号码，发送验证码信息
router.post('/msg', function(req, res) {
    // 接收手机号码并发送短信
    var phone = req.body.phone;

    // 获取随机的验证码
    var code = require('../../base/base').rand(1000, 9999);

    // 发送
    var TopClient = require('../../base/msg/topClient.js').TopClient;

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
                // 发送成功
                res.json({
                    success: 0
                })
            } else {
                // 发送失败
                res.json({
                    success: 1
                });
            }
        })
})
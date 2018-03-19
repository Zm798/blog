module.exports = {
	md5:function(password){
		// 1. 引入加密模块（ 原生模块）
		var crypto = require('crypto');

		// 2. 定义加密方式
		var md5 = crypto.createHash('md5');
		md5.update(password);

		// 3. 生成加密密码
		return md5.digest('hex');
	}
}
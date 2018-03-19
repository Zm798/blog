// 文件上传
/*
 * @params Object req:请求对象
 * @params String uploadDir: 上传文件的目录
 * @return Promise 返回的是一个对象
 */
exports.upload = function (req, uploadDir) {
    return new Promise(function (resolve, reject) {
        // 1.引入文件上传模块
        let formidable = require('formidable');

        // 2.创建解析表单数据
        let form = new formidable.IncomingForm();

        // 3.设置表单选项
        form.encoding = 'utf-8';
        // 上传文件的文件目录
        form.uploadDir = uploadDir;
        // 保留后缀名
        form.keepExtensions = true;

        //4.解析表单
        form.parse(req, function (err, fields, files) {
            if (err) {
                // 解析失败
                reject(err);
            } else {
                // 解析成功
                resolve({fields, files});
            }
        });
    })
}
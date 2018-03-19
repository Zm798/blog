var mongoose  = require('mongoose');

mongoose.connect('mongodb://localhost:27017/blog');

// 定义用户数据字段
var Schema = mongoose.Schema;
var UserSchema = new Schema({
	username: String,
	password: String,
	age: Number,
	sex: String,
	likes: Array,
	place: String,
	intro: String,
	avatar: String
}, {timestamps:true});
exports.User = mongoose.model('User', UserSchema);

// 定义用户数据字段
var TypeSchema = new Schema({
	typename: String,
}, {timestamps:true});
exports.Type = mongoose.model('Type', TypeSchema);

// 定义用户数据字段
var ContentSchema = new Schema({
	articlename: String,
	text:String,
	type: {type: Schema.Types.ObjectId, ref: 'Type'}
}, {timestamps:true});
exports.Content = mongoose.model('Content', ContentSchema);

// 定义用户数据字段
var ShopSchema = new Schema({
	title: String,
	image: String,
	evaluate: String,
	author: String
})
exports.Shop = mongoose.model('Shop', ShopSchema);

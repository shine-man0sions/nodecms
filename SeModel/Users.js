var mongoose = require('mongoose');
var validate = require('mongoose-validator');
//String
//Number
//Date
//Buffer
//Boolean
//Mixed
//Objectid
//Array
var emailValidator = [
    validate({
        validator: 'isEmail',
        message: '邮箱隔格式错误'
    })
];
var nameValidator = [
    validate({
        validator: 'isLength',
        arguments: [6, 12],
        message: '用户名必须在 {ARGS[0]} - {ARGS[1]} 之间'
    }),
    validate({
        validator: 'matches',
        arguments: /\d+/,
        message: '用户名不能使用特殊字符'
    })
];

var Schema = mongoose.Schema;

var Users = new Schema({
    name: { type: String, required: true, unique: true,validate: nameValidator },
    passwd: { type: String, required: true },
    type: { type: Number, required: true,default:0 }, //0-普通用户，1-管理员
    email: { type: String, required: true ,unique: true,validate: emailValidator},
    createtime: { type: Date, required: true, default: Date.now  },
    updatetime: { type: Date, default: Date.now  }

});

module.exports = db.model('Users', Users);


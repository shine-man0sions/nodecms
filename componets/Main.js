/*
* 全局公用函数
* */

function Main(){
    //加载数据模型
    this.loadModel = function loadModel(model,condition,callback){
        model.find(condition,function(err,data){

            if(data.length>0)
                callback(data[0]);
            else
                callback(null);
        })

    }
    //检查管理员用户权限
    this.checkAdmin = function(user){
        if(!user)
            return false;
        if(user.type!=1)
            return false
        return true;
    }

    var util = require('util');
    /*
    * 标准api返回
    *
    * */
    this.api = function(err,message,data){
        var err = err || 1;
        var data = data || [];
        var message = message || 'some error';
        var res = {err : err,message:message,data:data}
        return res;

    }
    /*
    * 构造翻页,只显示4个按钮
    *
    * */
    this.stePager = function(req,total){
        var pages  = [];
        var num = Math.ceil(total/req.query.size);
        var url = req.originalUrl.replace(/[\?|&]page=\d+/,"");
        var nowPage = req.query.page;
        for(var i=0;i<num;i++)
        {
            var idx = i+1;

//            if(idx<nowPage-2 || idx>nowPage*1+2)
//            {
//                console.log(idx);
//                continue;
//            }


            if(url.match(/\?/))
            {
                pages.push({url:url+'&page='+idx,idx:idx});
            }
            else
            {
                pages.push({url:url+'?page='+idx,idx:idx});
            }

        }
        var result = {nowPage:req.query.page,pages:pages,total:total};

        return result;
    }
       /*
    * mongoose 错误提示简化
    * */
    this.errorHelper = function (err) {



        var errors = [];
        //If it isn't a mongoose-validation error, just throw it.
        if (err.name === 'ValidationError')
        {
            var messages = {
                'required': "%s 必填.",
                'min': "%s below minimum.",
                'max': "%s above maximum.",
                'enum': "%s not an allowed value."
            };

            //A validationerror can contain more than one error.


            //Loop over the errors object of the Validation Error
            Object.keys(err.errors).forEach(function (field) {
                var eObj = err.errors[field].properties;

                //If we don't have a message for `type`, just push the error through

                if (!messages.hasOwnProperty(eObj.type))
                {

                    errors.push({field:field,message:eObj.message});
                }
                //Otherwise, use util.format to format the message, and passing the path
                else
                {

                    errors.push({field:field,message:util.format(messages[eObj.type], eObj.path)});
                }
            });

        }
        console.log(err.name);
        if(err.name === 'MongoError')
        {
            console.log(err.message);
            //E11000 duplicate key error index: db1.users.$name_1  dup key: { : "admin1" }
            var p = err.message.match(/index: \w+\..*\$(.*?)_1.*?dup key: \{ : "([^"]+?)" \}/);
            console.log(p);
            if(p.length==3)
            {
                var field = p[1];
                var value = p[2];
                errors.push({field:p[1],message:util.format("%s 已经存在",value)});
            }



        }


        return errors;
    }


}
var main = new Main();
module.exports = main;
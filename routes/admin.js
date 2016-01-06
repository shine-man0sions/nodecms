var express = require('express');
require('mongoose-pagination');


var router = express.Router();

var Users = require('../SeModel/Users');
var md5 = require('md5');

router.all('*', function(req, res, next) {
    if(req.url!='/login')
    {

        //if(!Main.checkAdmin(req.session.user))
        //    res.redirect('/admin/login');

    }
    next();


});

router.get('/login',function(req,res,next){

    Users.find({email:'81434146@qq.com'},function(err,data){
        if(data.length<1)
        {
            Users.create({email:'81434146@qq.com',passwd:md5('admin'),name:'admin1',type:1},function(err,data){
                console.log(err,data);
               return res.render('admin/default/login',{layout:'layouts/colum1'});
            });
        }
        else
        {
           return res.render('admin/default/login',{layout:'layouts/colum1'});
        }
    });


});
router.post('/login',function(req,res,next){
    var email = req.body.email;
    var passwd = req.body.passwd;

    Users.find({email:email,passwd:md5(passwd),type:1},function(err,data){
        console.log(req.body);
        if(data.length>0)
        {
            req.session.Users = data[0];
            res.redirect('/admin/');
        }
        else
        {

            res.locals.error = "用户名或密码错误";
            res.render('admin/default/login',{layout:'layouts/colum1'});
        }

    });



});


router.get('/', function(req, res, next) {

   res.render('admin/default/default',{title:'系统首页',layout:'admin/layouts/admin'});

});
/*
* 文章管理
* */

//文章分类列表
router.get('/articleCat', function(req, res, next) {
    var parentid = req.query.parentid;
    var condition = {};

    if(parentid)
        condition = {parentid:parentid};
    console.log(parentid,condition);
     var ArticleCat = require('../SeModel/ArticleCat');
    ArticleCat.find(condition,function(err,data){
        if(req.query.ajax)
        {
            return res.json(data);
        }
        res.render('admin/articleCat/index',{title:'分类列表',data:data,layout:'admin/layouts/admin'});
    });


});
//文章分类创建
router.get('/articleCat/create', function(req, res, next) {

    var ArticleCat = require('../SeModel/ArticleCat');
    ArticleCat.find({},function(err,data){
        res.render('admin/articleCat/form',{title:'分类创建',cats:data,data:{},layout:'admin/layouts/admin'});
    });


});
router.post('/articleCat/create', function(req, res, next) {

    var ArticleCat = require('../SeModel/ArticleCat');

    ArticleCat.create(req.body,function(err,data){
        if(err)
        {
            var errors = Main.errorHelper(err);
            return res.json(errors);
        }
        else
        {
            if(req.body.ajax)
            {
                return res.json({err:0,message:'操作成功',gourl:'/admin/articleCat'});
            }
            return  res.render('admin/articleCat/form',{title:'分类创建',error:stringify(err),layout:'admin/layouts/admin'});
        }



    });


});

//文章分类修改
router.get('/articleCat/update', function(req, res, next) {

    var ArticleCat = require('../SeModel/ArticleCat');
    ArticleCat.find({_id:req.query.id},function(err,data){
        if(err)
        {
            return res.end(err);
        }
       res.render('admin/articleCat/form',{title:'分类编辑',data:data[0],layout:'admin/layouts/admin'});
    })



});
router.post('/articleCat/update', function(req, res, next) {

    var ArticleCat = require('../SeModel/ArticleCat');
    ArticleCat.find({_id:req.query.id},function(err,data){
        if(err)
        {
            return res.json(err);
        }
        var model = data[0];

        model.name = req.body.name;
        model.parentid = req.body.parentid;
        model.image = req.body.image;
        model.content = req.body.content;
        model.sort = req.body.sort;
        model.updatetime = new Date();
        model.save(model,function(err,data){
            if(err)
            {
                var errors = Main.errorHelper(err);
                return res.json(errors);
            }
            else
            {
                if(req.body.ajax)
                {
                    return res.json({err:0,message:'操作成功',gourl:'/admin/articleCat'});
                }
                return  res.render('admin/articleCat/form',{title:'分类编辑',error:stringify(err),layout:'admin/layouts/admin'});
            }


        })

    })



});
//删除分类
router.get('/articleCat/delete', function(req, res, next) {

    var ArticleCat = require('../SeModel/ArticleCat');
    ArticleCat.find({_id:req.query.id},function(err,data){

        if(err)
        {
            return res.end(err);
        }
        var model = data[0];
        if(model)
        {
            var catid = model.catid;

            model.remove(function(err){
                console.log('remove');
                res.redirect('/admin/articleCat');
            });

        }else
        {
            res.redirect('/admin/articleCat');
        }

    })



});

//文章列表
router.get('/article', function(req, res, next) {
    var catid = req.query.catid ;
    var condition = catid ? {catid:catid}:{};
    var Article = require('../SeModel/Article');
    Article.find(condition,function(err,data){
        if(req.query.ajax)
        {
            return res.json(data);
        }

        res.render('admin/article/index',{title:'文章列表',data:data,layout:'admin/layouts/admin'});
    });


});
//文章创建
router.get('/article/create', function(req, res, next) {

    var ArticleCat = require('../SeModel/ArticleCat');
    ArticleCat.find({},function(err,data){
        console.log(data);
        res.render('admin/article/form',{title:'文章创建',cats:data,data:{},layout:'admin/layouts/admin'});
    });


});
router.post('/article/create', function(req, res, next) {

    var Article = require('../SeModel/Article');

    Article.create(req.body,function(err,data){
        if(err)
        {
            var errors = Main.errorHelper(err);
            return res.json(errors);
        }
        else
        {
            if(req.body.ajax)
            {
                return res.json({err:0,message:'操作成功',gourl:'/admin/article?catid='+data.catid});
            }
            return  res.redirect('/admin/article?catid='+data.catid);
        }



    });


});

//文章修改
router.get('/article/update', function(req, res, next) {

    var Article = require('../SeModel/Article');
    Article.find({_id:req.query.id},function(err,data){
        console.log(data);
        if(err)
        {
            return res.end(err);
        }
        res.render('admin/article/form',{title:'分类编辑',data:data[0],layout:'admin/layouts/admin'});
    })



});
router.post('/article/update', function(req, res, next) {

    var Article = require('../SeModel/Article');
    Article.find({_id:req.query.id},function(err,data){
        if(err)
        {
            return res.json(err);
        }
        var model = data[0];

        model.name = req.body.name;
        model.catid = req.body.catid;
        model.author = req.body.author;
        model.sort = req.body.sort;
        model.image = req.body.image;
        model.content = req.body.content;
        model.updatetime = new Date();
        model.save(model,function(err,data){
            if(err)
            {
                var errors = Main.errorHelper(err);
                return res.json(errors);
            }
            else
            {
                if(req.body.ajax)
                {
                    return res.json({err:0,message:'操作成功',gourl:'/admin/article?catid='+model.catid});
                }
                return  res.redirect('/admin/article?catid='+model.catid);
            }


        })

    })



});
//文章删除
router.get('/article/delete', function(req, res, next) {
    console.log(req.query.id,new Date());
    var Article = require('../SeModel/Article');
    Article.find({_id:req.query.id},function(err,data){

        if(err)
        {
            return res.end(err);
        }
        var model = data[0];
        if(model)
        {
            var catid = model.catid;

            model.remove(function(err){
                console.log('remove');
                res.redirect('/admin/article?catid='+catid);
            });

        }else
        {
            return res.redirect(req.headers['referer']);
        }

    })



});


//用户列表
router.get('/users', function(req, res, next) {
    var Users = require('../SeModel/Users');

    var type = req.query.type ;
    var condition = type ? {type:type}:{};

    Users.find(condition).paginate(req.query.page, req.query.size, function(err, data, total) {

            if(req.query.ajax)
            {
                return res.json(data);
            }
       var pager = Main.stePager(req,total);
        //console.log(pager);
       res.render('admin/users/index',{title:'用户列表',data:data,layout:'admin/layouts/admin',pager:pager});

    });


});
//用户创建
router.get('/users/create', function(req, res, next) {

    res.render('admin/users/form',{title:'用户创建',data:{},layout:'admin/layouts/admin'});


});
router.post('/users/create', function(req, res, next) {



    Users.create(req.body,function(err,data){

        if(err)
        {
            //console.log(err);

            var errors = Main.errorHelper(err);
            //console.log(err,errors);
            return res.json(errors);
        }
        else
        {
            if(req.body.ajax)
            {
                return res.json({err:0,message:'操作成功',gourl:'/admin/users?type='+data.type});
            }
            return res.redirect('/admin/users?type='+data.type);
        }


    });


});

//用户修改
router.get('/users/update', function(req, res, next) {


    Users.find({_id:req.query.id},function(err,data){

        if(err)
        {
            return res.end(err);
        }
        res.render('admin/users/form',{title:'用户编辑',data:data[0],layout:'admin/layouts/admin'});
    })



});
router.post('/users/update', function(req, res, next) {


    Users.find({_id:req.query.id},function(err,data){
        if(err)
        {
            return res.json(err);
        }
        var model = data[0];

        model.name = req.body.name;
        model.type = req.body.type;
        model.email = req.body.email;
        if(req.body.passwd != model.passwd)
            model.passwd = md5(req.body.passwd);
        model.updatetime = new Date();
        model.save(model,function(err,data){
            if(err)
            {
                console.log(err);
                var errors = Main.errorHelper(err);
                return res.json(errors);
            }
            else
            {
                if(req.body.ajax)
                {
                    return res.json({err:0,message:'操作成功',gourl:'/admin/users?type='+data.type});
                }
                return res.redirect('/admin/users?type='+data.type);
            }


        })

    })



});
//用户删除
router.get('/users/delete', function(req, res, next) {

    Users.find({_id:req.query.id},function(err,data){

        if(err)
        {
            return res.end(err);
        }
        var model = data[0];
        if(model)
        {
            var type = model.type;

            model.remove(function(err){

                return res.redirect('/admin/users?type='+type);
            });

        }
        else
        {

            return res.redirect(req.headers['referer']);
        }

    })



});



module.exports = router;

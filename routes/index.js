var express = require('express');
var router = express.Router();
var Article = require('../SeModel/Article');
var ArticleCat = require('../SeModel/ArticleCat');

/* GET home page. */
router.get('/logout', function(req, res, next) {
  req.session.user = {};
  res.redirect("/");

});
//首页
router.get('/', function(req, res, next) {
    Article.find({},function(err,arts){
        ArticleCat.find({},function(err,cats){

            res.render('web/default/index',{arts:arts,cats:cats});
        })

    })

});
//文章分类
router.get('/articleCat', function(req, res, next) {
    var catid = req.query.catid ;
    var condition = catid ? {catid:catid}:{};

    Article.find(condition,function(err,data){
        if(req.query.ajax)
        {
            return res.json(data);
        }
        res.render('web/article/index',{title:'文章列表',data:data});
    });

});
//文章内页
router.get('/article/view', function(req, res, next) {

    var id = req.query.id ;

    Article.find({_id:id},function(err,data){
        var data = data[0];
        if(req.query.ajax)
        {
            return res.json(data);
        }
        res.render('web/article/view',{title:data.name,data:data});
    });

});


module.exports = router;

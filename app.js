var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressLayouts = require('express-ejs-layouts');
var Uploader = require('express-uploader');

db = require('./data/config');
Main = require('./componets/Main');
var admin = require('./routes/admin');
var routes = require('./routes/index');
var users = require('./routes/users');


app = express();

var ueditor = require('ueditor-nodejs');
app.use('/ueditor/ue', ueditor({//这里的/ueditor/ue是因为文件件重命名为了ueditor,如果没改名，那么应该是/ueditor版本号/ue
    configFile: '/ueditor/php/config.json',//如果下载的是jsp的，就填写/ueditor/jsp/config.json
    mode: 'local', //本地存储填写local
//    accessKey: 'Adxxxxxxx',//本地存储不填写，bcs填写
//    secrectKey: 'oiUqt1VpH3fdxxxx',//本地存储不填写，bcs填写
      staticPath: path.join(__dirname, 'public/uploads'), //一般固定的写法，静态资源的目录，如果是bcs，可以不填
//    dynamicPath: '/blogpicture' //动态目录，以/开头，bcs填写buckect名字，开头没有/.路径可以根据req动态变化，可以是一个函数，function(req) { return '/xx'} req.query.action是请求的行为，uploadimage表示上传图片，具体查看config.json.
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');
app.use(expressLayouts);
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    cookie:{  httpOnly: true,  maxAge: 1000*60*60},
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use(function (req, res, next) {
    req.query.page = req.query.page || 1;
    req.query.size = req.query.size || 10;
    res.locals.user = req.session.user || {};
    res.locals.title = 'Man0sions Shop';
    res.locals.err = {message: '', errors: {}};
    res.locals.error = '';
    res.locals.pager = {pages:[]};
    res.locals.defaultImg = '/images/default.png';

    next();
});

app.all('/upload', function (req, res, next) {

    var uploader = new Uploader({
        debug: true,
        validate: true,
        thumbnails: false,
        thumbToSubDir: true,
        tmpDir: __dirname + '/public/tmp',
        publicDir: __dirname + '/public',
        uploadDir: __dirname + '/public/uploads',
        uploadUrl: '/uploads/',
        thumbSizes: [140, [100, 100]]
    });
    uploader.uploadFile(req, function (data) {

        res.send(JSON.stringify(data), {'Content-Type': 'text/plain'}, 200);
    });
});
//app.use(require('flash')());
app.use('/', routes);
app.use('/admin', admin);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

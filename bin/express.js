var express = require('express');
var path = require('path');
var fs     = require('fs');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var ejs = require('ejs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


var index = require('../routes/index');
var upload = require('../routes/upload');
var file = require('../routes/file');
var beacon = require('../routes/beacon');
var tour = require('../routes/tour');
var storage = require('../routes/file_storage');

/**
 * 系统参数设置
 */
var config = require('../config/config.js');

/******************express配置模板视图**********************************/
var app = express();
// support html
app.engine('html', ejs.__express);

// view engine setup
app.set('views', path.join(__dirname, "..", 'views'));
app.set('view engine', 'html');

/******************引入要使用的模块*************************************/

// 定义icon图标，参数为图标的路径。如果不指明，则用默认的express图标
//app.use(favicon(__dirname + '/public/favicon.ico'));

// 加载日志中间件，定义日志和输出级别
app.use(morgan('dev'));

app.use(cookieParser('sae-cmpp'));
// session
app.use(session({
    resave: true,
    rolling: false,
    saveUninitialized: false,
    secret: 'sae-cmpp',
    cookie: {
        maxAge: 1000 * 60 * 60 * 12, // 12 hours
        // domain: '.beaconice.cn',
        httpOnly: true
    },
    store: new MongoStore({
        url: config.session.url,
        autoRemove: 'native', // Default
        touchAfter: 24 * 3600, // time period in seconds
        // collection: 'session'
    })
}));

// 加载解析json的中间件,接受json请求
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.text({
    type: 'text/*',
    limit: '10mb'
}))
app.use(bodyParser.raw({
    limit: '5mb'
}));

// 静态文件目录设置,设置public文件夹为存放静态文件的目录
app.use(express.static(path.join(__dirname, "..", 'public')));

// 登录拦截器
// app.use(function (req, res, next) {  
	
// });

//多语言读取json语言包
app.use(function (req, res, next) {
    var langs = (function () {
        var dpath = path.join(__dirname, "..", 'config/lang'),
            files = fs.readdirSync(dpath),
            langss = {};
        for (var i = 0; i < files.length; i++) {
            var name = files[i].replace(path.extname(files[i]), '');
            langss[name] = require(path.join(dpath, files[i]));
        }
        return langss;
    }());
    // console.log("langs:",langs);
    var lang = req.cookies.lang || "en-US";
    // console.log("lang:",lang);
    res.cookie('lang', lang, { path: '/', maxAge: 900000000 });
    // console.log("lang目标:",langs[lang]);
    res.locals.lang = langs[lang];
    res.locals.langlocale = lang;
    next();
});

// 跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
});

// 路由控制器
app.use('/', index);
app.use('/file', upload);
app.use('/file', file);
app.use('/beacon/', beacon);
app.use('/tour/', tour);
app.use('/storage/file', storage);

// catch 404 and forward to error handler 
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
        console.error("500 error: " + err);
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
    console.error("500 error: " + err);
});

module.exports = app;
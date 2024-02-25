const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');

const path = require('node:path');
const bodyParser = require('body-parser');
const app = express();
const bcrypt = require('bcryptjs');



app.set('views', path.join(__dirname, 'views'));
console.log(path.join(__dirname, 'views'));

app.use(session({
    secret: 'your-secret-key', // 将此替换为您自己的密钥
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 1000 * 60 * 60, // 会话失效时间为1小时
        // 其他 cookie 选项（可选）
    }
}));

const {sup} = require('./middlewares/middle');
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(cookieParser());

app.use(express.static('public'));
app.use('/', express.static(path.join(__dirname, '../public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//equire('./routes/router')(app);
app.use('/',require(path.join(__dirname,'routes/router')));

app.use((req,res,next) => {
    res.sendStatus(404);
    next();
});
app.set('port',process.env.PORT || 3000);

app.listen(app.get('port'),() => {
    console.log(`server on port ${app.get('port')}`);
});
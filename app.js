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
    secret:'my_secret',
    resave:false,
    saveUninitialized:true,
}));

const {sup} = require('./middlewares/middle');

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(morgan('dev'));

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
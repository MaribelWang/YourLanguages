const express = require('express');
const morgan = require('morgan');
const path = require('node:path');
const bodyParser = require('body-parser');

const app = express();

app.set('port',process.env.PORT || 3000);

app.set('views', path.join(__dirname, 'views'));
console.log(path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/',(req,res) => {
    res.render('index');
});

app.listen(app.get('port'),() => {
    console.log(`server on port ${app.get('port')}`);
});
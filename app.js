const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.set('port',process.env.PORT || 3000);

app.set('views',path.join(__dirname, 'view'));
app.set('views engine', 'ejs');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/',(req,res) => {
    res.send('Hello, world');
});

app.listen(app.get('port'),() => {
    console.log(`server on port ${app.get('port')}`);
});
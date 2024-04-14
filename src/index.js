// This is the entry point of the app
// (The first file to execute when the app starts).

// Require the necessary to work with database
const sequelize = require('../database/database');
const User = require('../database/models/User');
const UserType = require('../database/models/UserType');

// Require and instance express.
const express = require('express');
const app = express();


const session = require('express-session');
const cookieParser = require('cookie-parser');

// Override form methods
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// Require path to work with routes
const path = require('node:path');

// Require morgan to debug request
const morgan = require('morgan');

// Is better to work this way with routes to avoid problems with 
// paths syntax between different OS
// Whit this I am setting the views folder
app.set('views', path.join(__dirname, 'views'));

// Seting ejs as views engine
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/assets', express.static('assets'));


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


app.use(session({
    secret: 'my_secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false, // Change to true if using HTTPS
    },
}));

// Set the router
app.use('/', require(path.join(__dirname, 'routes/router')));
const userRoutes = require('./routes/userRoutes');
// ...
app.use('/', userRoutes);


//--------------------------------------------------------
// Set a default port in case we didn't configure anything
app.set('port', process.env.PORT || 3000);

// The server must listen in a port
async function main(){
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync({force: process.env.NODE_ENV === 'development'});
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    app.listen(app.get('port'), () => {
        console.log(`server listening on port ${app.get('port')}`);
    });
}

// Remember to call the main function to start the server
main();



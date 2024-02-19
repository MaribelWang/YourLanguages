const sup = (req, res, next) => {
    console.log("Application Middleware");

    next();
}

const how = (req, res, next) => {
    res.redirect('/teacher-form');

    next();
}

module.exports = {sup,how};

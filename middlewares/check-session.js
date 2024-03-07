const checkSession = (req,res,next) => {
    if(req.session.user || req.cookies.Mycookie){
        next();
    }else{
        res.redirect('/login-form');
    }
}

module.exports = checkSession;
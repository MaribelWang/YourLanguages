const express = require('express');
const router = express.Router();

router.get('/',(req, res) => {
    res.render('index',{title:"Your Languages"});
});
router.get('/teacher-form',(req,res) => {
    res.render('teacher-form', {title: "New teacher page"});
});

module.exports = router;
//??
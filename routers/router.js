const express = require('express');
const router = express;
module.exports = (app) =>{
    
    let tutors = [];
    app.locals.tutors = tutors;

    app.get('/',(req, res) => {
        res.render('index',{title:"Your Languages"});
    });
    app.get('/teacher-form',(req,res) => {
        res.render('teacher-form', {title: "New teacher page"});
    });

    app.post('/teacher-form/create',(req,res) => {
        if(!req.body.name || !req.body.description){
            res.send(400).send('The name and description should not be blank');
        }
        let newTutor = {
            name: req.body.name,
            description: req.body.description,
            date:new Date()
        };
        tutors.push(newTutor);
        res.redirect('/');
        console.log(tutors);
    });
}
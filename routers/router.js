const express = require('express');
const router = express;
const fs = require('fs');
const path = require('path');

const jsonFilePath = path.join(__dirname,'../data/data.json');

function readData(){
    return JSON.parse(fs.readFileSync(jsonFilePath,'utf-8'));
}

module.exports = (app) =>{
    const tutorsData = readData().tutors || [];

    app.get('/',(req, res) => {
        res.render('index',{
        title:"Your Languages", 
        tutors:tutorsData
    }
        );
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
            id:new Date()
        };
        res.redirect('/')
        tutors.push(newTutor);;
        console.log(tutors);
    });
}

function generateUniqueId (){
    const timestamp = new Date().getTime();
    const randomPart = Math.floor(Math.random() * 1000);
    return `${timestamp}-${randomPart}`;
}
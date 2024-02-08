const express = require('express');
const router = express;
const fs = require('fs');
const path = require('path');

const upload = require('../middlewares/upload');

const jsonFilePath = path.join(__dirname,'../data/data.json');


function readData(){
    return JSON.parse(fs.readFileSync(jsonFilePath,'utf-8'));
}

module.exports = (app) =>{
    app.get('/',(req, res) => {
        const tutorsData = readData().tutors || [];
        res.render('index',{
        title:"Your Languages", 
        tutors:tutorsData
       });
    });

    app.get('/teacher-form',(req,res) => {
        res.render('teacher-form',{
            title:"Teacher form",
            name:null,
            description: null,
            id:null
        });
    });
    
    app.post('/teacher-form/create',upload.single('avatar'), (req,res) => {
        const data = readData();

        if(!req.body.name || !req.body.description){
            res.send(400).send('The name and description should not be blank');
        }
        let newTutor = {
            id:generateUniqueId(),
            name: req.body.name,
            image: req.file.path,
            description: req.body.description
        };
        if(data != null){
            data.tutors.push(newTutor);
            writeData(data);
            res.redirect('/');
        }   
    });


    app.get('/teacher-form/:id/edit',(req,res) => {
        const data = readData();
        data.tutors.forEach(tutor => {
            if(tutor.id === req.params.id){
                res.render('teacher-form',{
                    title:'Update profile',
                    name: tutor.name,
                    description: tutor.description,
                    id: tutor.id
                })
                console.log(tutor);
            }  
        });
    });

    app.put('/teacher-form/:id/edit',(req,res) =>{
        const data = readData();
        if(!req.body.name || !req.body.description){
            res.send(400).send('Teachers must have a name and a description');
        }
        data.tutors.forEach(tutor =>{
            if(tutor.id === req.params.id){
                tutor.name = req.body.name;
                tutor.description = req.body.description;
            }
            console.log(tutor);
        });
        writeData(data);
        res.redirect('/');
    });
    app.delete('/teacher-form/:id/delete',(req,res) =>{
        const data = readData();
        const tutorIndex = data.tutors.findIndex((tutor) => tutor.id === req.params.id);
        // console.log(req.params.id);
        // console.log(data);
        // console.log(tutorIndex);
        data.tutors.splice(tutorIndex,1)
        writeData(data);
        res.redirect('/');
    });
}
function writeData(data){
    const updataJsonData = JSON.stringify(data, null, 2);
    fs.writeFile(jsonFilePath,updataJsonData,'utf-8' ,(err) => {
        if(err){
            console.error('Error writing file:',err);
            return;
        }
    });
}

function generateUniqueId (){
    const timestamp = new Date().getTime();
    const randomPart = Math.floor(Math.random() * 1000);
    return `${timestamp}-${randomPart}`;
}

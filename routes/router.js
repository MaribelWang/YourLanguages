const express = require('express');
const router = express;
const fs = require('fs');
const path = require('path');

const upload = require('../middlewares/upload');

const {how} = require('../middlewares/middle'); //?
const checkSession = require('../middlewares/check-session');
const { emit } = require('process'); //?

const tutorsFilePath = path.join(__dirname,'../public/data/data.json');
const usersFilesPath = path.join(__dirname,'../public/data/users.json');


function readData(filePath){
    return JSON.parse(fs.readFileSync(filePath,'utf-8'));
}

module.exports = (app) =>{
    app.get('/', checkSession, (req, res) => {
        const tutorsData = readData(tutorsFilePath).tutors || [];
        
        res.render('index',{
        title:"Your Languages", 
        tutors:tutorsData,
        user: req.session.user
       });
    });

    app.get('/teacher-form',checkSession, (req,res) => {
        res.render('teacher-form',{
            title:"Teacher form",
            name:null,
            description: null,
            id:null,
            user:req.session.user
        });
    });
    app.post('/teacher-form/create',checkSession, upload.single('avatar'), (req,res) => {
        const data = readData(tutorsFilePath);

        if(!req.body.name || !req.body.description){
            res.send(400).send('The name and description should not be blank');
        }
        let imagePath = req.file ? req.file.path : '';
        if(imagePath != '')
        imagePath = imagePath.replace(/^public\\/,'');

        let newTutor = {
            id:generateUniqueId(),
            name: req.body.name,
            image:imagePath,
            description: req.body.description
        };
        if(data != null){
            data.tutors.push(newTutor);
            writeData(data);
            res.redirect('/');
        }   
    });

    app.get('/teacher-form/:id/edit',checkSession, (req,res) => {
        const data = readData();    
        data.tutors.forEach(tutor => {
            if(tutor.id === req.params.id){
                res.render('teacher-form',{
                    title:'Update profile',
                    name: tutor.name,
                    description: tutor.description,
                    id: tutor.id,
                    user:req.session.user
                })
            }  
        });
    });

    app.put('/teacher-form/:id/edit', checkSession, upload.single('avatar'), (req,res) =>{
        const data = readData(tutorsFilePath);
        if(!req.body.name || !req.body.description){
            res.send(400).send('Teachers must have a name and a description');
        }
        data.tutors.forEach(tutor =>{
            if(tutor.id === req.params.id){
                tutor.name = req.body.name;
                tutor.description = req.body.description;
                
                if(req.file != null){
                    const filePath = path.join(__dirname,`../public/${tutor.image}`)

                    fs.unlink(filePath,(err) =>{
                        if(err){
                            console.log(`Error deleting file: ${err.message}`);
                        }else {
                            console.log('File deleted successfully');
                        }
                    });
                    let image = req.file.path;
                    image = image.replace(/^public\\/, '');
                    tutor.image = image;
                }
            }
            console.log(tutor);
        });
        writeData(data);
        res.redirect('/');
    });

    app.delete('/teacher-form/:id/delete', checkSession, (req,res) =>{
        const data = readData(tutorsFilePath);
        const tutorIndex = data.tutors.findIndex((tutor) => tutor.id === req.params.id);

        const filePath = path.join(__dirname,`../public/${data.tutors[tutorIndex].image}`);
        fs.unlink(filePath,(err) => {
            if(err){
                console.log(`Can not delete file: ${err.message}`);
            }else{
                console.log('File deleted successfully')
            }
        }) 
        data.tutors.splice(tutorIndex,1);
        writeData(data);
        res.redirect('/');
    });
    app.get('/login-form', (req, res) => {
        res.render('login-form',{
            title:'login-form'
        });
    });
    app.get('/log-out',(req,res) => {
        delete req.session.email;
        res.render('login-form',{
            title:'login-form'
        });
    });
    app.delete('/delete-account/:id',(req,res) => {
        const data = readData(usersFilesPath);
        const userIndex = data.users.findIndex((user) => unsubscribe.id == req.params.id);

        data.users.splice(userIndex,1);
        writeData(data,usersFilesPath);
        res.redirect('/login-form');
    });
    app.post('/login', (req,res) => {
        const data = readData(usersFilesPath);
        if(data.users.length > 0){
            data.users.forEach(user => {
                if(req.body.email === user.email){
                    if(req.body.password === user.password){
                        req.session.user = user;
                        res.redirect('/');
                    }else{
                        res.send('Email or password is incorrect');
                    } 
                }else{
                    res.send('Email or password is incorrect');
                }
            });
        }else{
            res.send("User doesn't exist");
        }
    });

    app.get('/register-form', (req,res) => {
        res.render('register-form',{
            title:'register-form'
        });
    });
    app.post('/register-form/create',(req,res) => {
        const data = readData(usersFilesPath)
        if(!req.body.email || !req.body.password){
            res.send(400).send('The account must have an email and password')
        }

        let newUser = {
            id:generateUniqueId(),
            email: req.body.email,
            password:req.body.password
        }
        req.session.user = newUser;
        if( data != null){
            data.ussers.push(newUser);
            writeData(data, usersFilesPath);
            res.redirect('/');
        }
    });

    }
    function writeData(data,filePath){
        const updataJsonData = JSON.stringify(data, null, 2);
        fs.writeFile(jsonFilePath,updataJsonData,'utf-8' ,(err) => {
            if(err){
                console.error('Error writing file:',err);
                return;
            }
            console.log('Data added to JSON file successfully.');
        });
    }
    function generateUniqueId (){
        const timestamp = new Date().getTime();
        const randomPart = Math.floor(Math.random() * 1000);
        return `${timestamp}-${randomPart}`;
    }

module.exports = router;
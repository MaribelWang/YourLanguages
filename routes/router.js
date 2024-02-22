const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const upload = require('../middlewares/upload');

const {how} = require('../middlewares/middle'); //?
const checkSession = require('../middlewares/check-session');
const { emit } = require('process'); //?

const tutorsFilePath = path.join(__dirname,'../public/data/data.json');
const usersFilesPath = path.join(__dirname,'../public/data/users.json');


function readData(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        let jsonData = JSON.parse(data);
        // 确保 'users' 数组存在
        if (!jsonData.users) {
            jsonData.users = []; // 如果不存在 'users'，则初始化
        }
        return jsonData;
    } catch (error) {
        console.error('读取或解析文件中的 JSON 时出错:', error);
        return { users: [] }; // 如果有错误，用一个空的 'users' 数组初始化
    }
}

router.get('/', checkSession, (req, res) => {
        const tutorsData = readData(tutorsFilePath).tutors || [];
        
        res.render('index',{
        title:"Your Languages", 
        tutors:tutorsData,
        user: req.session.user
       });
    });

    router.get('/teacher-form',checkSession, (req,res) => {
        res.render('teacher-form',{
            title:"Teacher form",
            name:null,
            description: null,
            id:null,
            user:req.session.user
        });
    });
    router.post('/teacher-form/create',checkSession, upload.single('avatar'), (req,res) => {
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
            writeData(data,tutorsFilePath);
            res.redirect('/');
        }   
    });

    router.get('/teacher-form/:id/edit',checkSession, (req,res) => {
        const data = readData(tutorsFilePath);    
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

    router.put('/teacher-form/:id/edit', checkSession, upload.single('avatar'), (req,res) =>{
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
        writeData(data,tutorsFilePath);
        res.redirect('/');
    });

    router.delete('/teacher-form/:id/delete', checkSession, (req,res) =>{
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
        writeData(data,tutorsFilePath);
        res.redirect('/');
    });
    router.get('/login-form', (req, res) => {
        res.render('login-form',{
            title:'login-form'
        });
    });
    router.get('/log-out',(req,res) => {
        delete req.session.email;
        res.render('login-form',{
            title:'login-form'
        });
    });
    router.delete('/delete-account/:id',(req,res) => {
        const data = readData(usersFilesPath);
        const userIndex = data.users.findIndex((user) => user.id == req.params.id);

        data.users.splice(userIndex,1);
        writeData(data,usersFilesPath);
        res.redirect('/login-form');
    });
    router.post('/login', (req,res) => {
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

    router.get('/register-form', (req,res) => {
        res.render('register-form',
        {
            title:'register-form'
        });
    });
    router.post('/register-form/create',(req,res) => {
        const data = readData(usersFilesPath);
        if(!req.body.email || !req.body.password){
            res.send(400).send('The account must have an email and password');
        }

        let newUser = {
            id:generateUniqueId(),
            email: req.body.email,
            password: req.body.password
        }
        console.log(newUser);
        req.session.user = newUser;
        if(data != null){
            data.users.push(newUser);
            writeData(data, usersFilesPath);
            res.redirect('/');
        }
    });

   function writeData(data, filePath) {
    const updatedJsonData = JSON.stringify(data, null, 2);
    fs.writeFile(filePath, updatedJsonData, 'utf-8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
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
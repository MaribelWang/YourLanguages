const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const upload = require('../middlewares/upload');

const {how} = require('../middlewares/middle'); //?
const checkSession = require('../middlewares/check-session');
const { emit } = require('process'); //?
const { cookie } = require('express-validator');

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

router.get('/', (req, res) => {
     //check req.cookies exist or not
        if(req.cookies.MyCookie){
            req.session.user = {email : req.cookies.MyCookie};
        }
        
        const tutorsData = readData(tutorsFilePath).tutors || [];
        res.render('index',{
        title:"Your Languages", 
        tutors: tutorsData,
        user: req.session.user ? req.session.user : {email: ""}
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
        req.session.destroy();
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

    router.post('/login', (req, res) => {
        const data = readData(usersFilesPath);
    
        // 登录逻辑...
        // 假设在登录成功时，从数据库中找到了匹配的用户信息，并存储在变量 user 中
    
        // 检查用户是否存在并且密码匹配
        const user = data.users.find(u => u.email === req.body.email);
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            // 登录成功，将用户信息存储到会话中，并重定向到首页
            req.session.user = user;
            console.log('User logged in:', req.session.user); // 添加日志记录
            if (req.body.remember) {
                // 如果用户选择了“记住我”，设置 Cookie
                res.cookie('Mycookie', user.email, {
                    maxAge: 1000 * 60 * 60,
                    //expires: new Date("2024-12-31"),
                    //httpOnly:true,
                    //secure: true
                });
            }
            res.redirect('/');
        } else {
            // 登录失败，返回错误信息给用户
            console.log('Login failed for email:', req.body.email); // 添加日志记录
            res.send('Email or password is incorrect');
        }
    }); 
    
    router.get('/teacher-form', checkSession, (req, res) => {
        console.log('Session user:', req.session.user); // 添加日志记录
        res.render('teacher-form', {
            title: "Teacher form",
            name: null,
            description: null,
            id: null,
            user: req.session.user
        });
    });
    
    // 其他路由处理程序中同样添加日志记录...
    
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

        //hash password
        let hash = bcrypt.hashSync(req.body.password, 10);
        let newUser = {
            id: generateUniqueId(),
            email: req.body.email,
            password: hash
        }
        
        
        if(data != null){
            data.users.push(newUser);
            writeData(data, usersFilesPath);
            //Create a session variable
            req.session.user = newUser;
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
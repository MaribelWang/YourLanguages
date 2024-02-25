const bcrypt = require('bcryptjs');
const path = require('path');


const usersFilesPath = path.join(__dirname,'../public/data/users.json');
const { validationResult } = require('express-validator');
const { readData, writeData, generateUniqueId } = require('./DatasController');

const authController = {
    goToLogin: (req, res) => {
        res.render('login-form',{
            title:'login-form'
        });
    }
    ,
    logOut:(req,res) => {
        req.session.destroy();
        res.render('login-form',{
            title:'login-form'
        });
    },
    deleteUserAccountById:(req,res) => {
        const data = readData(usersFilesPath);
        const userIndex = data.users.findIndex((user) => user.id == req.params.id);

        data.users.splice(userIndex,1);
        writeData(data,usersFilesPath);
        res.redirect('/login-form');
    },
    login:(req, res) => {
        const data = readData(usersFilesPath);
        let errors = validationResult(req);
        // 登录逻辑...
        // 假设在登录成功时，从数据库中找到了匹配的用户信息，并存储在变量 user 中
    
        // 检查用户是否存在并且密码匹配
        const user = data.users.find(u => u.email === req.body.email);
        if(errors.isEmpty()){
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
        }else{
            console.log(errors);
            res.render('login-form',{
                title:'login-form',
                errors:errors.mapped(),
                old:req.body
            })
        }
    },
    goToSignUpForm:(req,res) => {
        res.render('register-form',
        {
            title:'register-form'
        });
    },
    signUp:(req,res) => {
        const data = readData(usersFilesPath);
        let errors = validationResult(req);
        if(errors.isEmpty()){
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
        }else{
            res.render('register-form',{
                title:'login-form',
                errors:errors.mapped(),
                old:req.body
            })
         }
    }
}

module.exports = authController;
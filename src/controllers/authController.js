const bcrypt = require('bcryptjs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../../public/data/users.json');
const { validationResult } = require('express-validator');
const { readData, writeData, generateUniqueId } = require('./dataController');

//Require the model for the server
const User = require('../../public/data/userModel');
//Require the model for the database

const authController = {
    goToHome: (req, res) => {

        console.log("Session value (/)-> "+req.session.user)

        //If we have a cookie create a session
        if(req.cookies.MyCookie){
            req.session.user = {email: req.cookies.MyCookie}
        }
        
        // Make sure to add a default value in the case jsonData comes empty
        const users = readData(usersFilePath).users || []
        console.log("image path" + users.imagePath);
        res.render('home', {
            title: "Home",
            users: users,
            user: req.session.user ? req.session.user : { email: "" }
        });
    
    },
    goToLogin: (req, res ) => {
        res.render('login-form',
        {
            title: 'login-form'
        })
    },
    logOut: (req, res ) => {
        // Delete the session
        delete req.session.userId;
        res.render('login-form',
        {
            title: 'login-form'
        })
    },
    deleteUserById: (req, res) => {
        try {
            const data = readData(usersFilePath);
    
            // Find the user index
            const userIndex = data.users.findIndex((user) => user.id === req.params.id);
            if (userIndex === -1) {
                console.error(req.session.user.id);
                console.error('User not found');
            }
    
            // Delete from the array
            data.users.splice(userIndex, 1);
    
            // Update the json file
            writeData(data, usersFilePath);
    
            // Destroy the session and redirect
            req.session.destroy(() => {
                res.redirect('/login-form');
            });
        } catch (error) {
            console.error(error);
            // Handle the error, maybe redirect to an error page
            res.status(500).send('Server error');
        }
    },
    
    login: (req, res) => {
        const data = readData(usersFilePath);
        let errors = validationResult(req);
    
        // 如果没有错误则正常登录
        if (errors.isEmpty()) {
            // 如果数据库不为空
            if (data.users.length > 0) {
                data.users.forEach(user => {
                    // 查找用户邮箱并比较
                    if (req.body.email === user.email) {
                        // 检查哈希密码
                        let check = bcrypt.compareSync(req.body.password, user.hashedPassword);
    
                        // 如果用户和密码正确
                        if (check) {
                            req.session.userId = user.id; // 只保存用户ID到会话中
                            console.log('Session User ID:', req.session.userId);

                            

                            
                            // 如果记住我被选中，创建一个cookie
                            if (req.body.remember) {
                                res.cookie('MyCookie', user.email, {
                                    maxAge: 1000 * 60 * 60, // 1小时
                                });
                            }
    
                            res.redirect('/');
                        } else {
                            res.send('User or password is incorrect');
                        }
                    }
                });
            } else {
                res.send("User doesn't exist");
            }
        // 如果有错误在登录表单显示错误
        } else {
            res.render('login-form', {
                title: 'login-form',
                errors: errors.mapped(),
                old: req.body
            });
        }
    },
    
    goToSignUpForm: (req, res) => {
        res.render('register-form',
            {
                title: 'register-form'
            });
    },
    signUp: (req, res) => {
        const data = readData(usersFilePath);
        let errors = validationResult(req);
    
        // If there are no erros sing up normally
        console.log(errors);
        if (errors.isEmpty()) {

        let language = req.body.language; // 接收表单提交的语言
        let description = req.body.description; // 接收表单提交的描述
        let userType = req.body.userType; // 接收表单提交的账户类型
        let price = req.body.price;  //Receive the price from register form
            // hash password
            let hash = bcrypt.hashSync(req.body.password, 10);

            // Verify that the file string is not null
            let imagePath = req.file ? req.file.path : '';
        
            // Delete the "public" word
            if (imagePath != '')
                imagePath = imagePath.replace(/^public\\/, '');
 
            //Using the model instead of declaring the variable
            const newUser = new User(
                generateUniqueId(),
                req.body.firstName,
                req.body.lastName,
                req.body.email,
                req.body.gender,
                req.body.userType,
                hash,
                imagePath,
                language,
                description,
                price
            )

            if (data != null) {
                
                // Add the new professor to the data.json file
                data.users.push(newUser);
    
                writeData(data, usersFilePath);
    
                // Create a session variable
                req.session.user = newUser;
                res.redirect('/');
            }
        // If the validation has errors return to the login with the errors
        } else {
            res.render('register-form',
                {
                    title: 'register-form',
                    errors: errors.mapped(),
                    old: req.body
                }
            );
        }
    },
    
}

module.exports = authController;
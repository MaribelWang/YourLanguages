const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

const usersFilePath = path.join(__dirname, '../../public/data/users.json');

// 假设这是处理 GET 请求的路由，以显示编辑表单
router.get('/edit', (req, res) => {
  if (!req.session.userId) {
    console.log("1 " + req.session.userId);
    return res.redirect('/login-form');
  }

  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading user data:', err);
      return res.status(500).send('Server error');
    }

    const users = JSON.parse(data).users;
    const user = users.find(u => u.id === req.session.userId);
    console.log('req.session.userId ' + req.session.userId);
    console.log('users' + users);
    console.log('user ' + user);
    if (!user) {
      return res.status(404).send('User not found 1');
    }

    res.render('profile', {
      user: user,
      title: 'Profile Page'
  }); // 假设您有一个名为 'edit' 的视图
  });

  
});

// POST 请求处理用户提交的数据更新
router.post('/edit', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login-form');
  }

  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading user data:', err);
      return res.status(500).send('Server error 2');
    }

    let users = JSON.parse(data).users;
    const userIndex = users.findIndex(u => u.id === req.session.userId);

    if (userIndex === -1) {
      return res.status(404).send('User not found 3');
    }

    // 更新用户信息
    const { firstName, lastName, email, gender, language, price, description } = req.body;
    users[userIndex] = {...users[userIndex], firstName, lastName, email, gender, language, price, description};

    // 写回文件
    fs.writeFile(usersFilePath, JSON.stringify({ users }), 'utf8', (err) => {
        if (err) {
            console.error('Error writing user data:', err);
            return res.status(500).send('Server error');
        }

        res.redirect('/edit'); // 假设您希望更新后重定向到编辑页面
    });
  });
});

module.exports = router;

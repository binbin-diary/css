const express = require('express');
const mysql = require('mysql')
const models = require('../config/db');
const { getCurrentTime } = require('../utils/common');
const router = express.Router();
const connection = mysql.createConnection(models.mysql);
connection.connect();

// 登录
router.all('/login', function(req, res) {
  let selectUser = ''
  const params = {
    username: '',
    password: ''
  }

  if (req.method === 'GET') {
    const { username, password } = req.query
    params.username = username
    params.password = password
    selectUser = `select * from user where user_name = '${username}' and password = '${password}'`
  } else if (req.method === 'POST') {
    const { username, password } = req.body
    params.username = username
    params.password = password
    selectUser = `select * from user where user_name = '${username}' and password = '${password}'`
  }

  connection.query(selectUser, function(err, result) {
    if (err) {
      throw err
    }
    let resultData = {}
    // 用户是否存在
    if (result.length === 0) {
      console.log('用户名或密码失败', 222);
      resultData = {
        ret: 1001,
        msg: '用户名或密码失败',
        data: null
      }
      res.end(JSON.stringify(resultData))
    } else {
      const { id } = result[0]
      const hash = new Date().getTime();
      
      resultData = {
        ret: 0,
        msg: '登录成功',
        uid: `${id}-${hash}`,
        data: result[0]
      }
      const time = getCurrentTime()
      const updateSql = `UPDATE user SET last_login_time = '${time}' WHERE id = '${id}'`
      connection.query(updateSql, function(err, result) {
        if (err) {
          throw err
        }
        res.end(JSON.stringify(resultData))
      })
    }
  })
})

// 获取用户信息
router.get('/info', function(req, res) {
  let resultData = {}

  const id = req.headers['uid'].split('-')[0]
  const sql = `select * from user where id = '${id}'`
  connection.query(sql, function(err, result) {
    if (err) {
      throw err
    }
    // 用户是否存在
    if (result.length === 0) {
      resultData = {
        ret: 1001,
        msg: '获取信息失败',
        data: null
      }
    } else {
      resultData = {
        ret: 0,
        msg: '获取成功',
        data: result[0]
      }
    }
    res.end(JSON.stringify(resultData))
  })
})

// 退出登录
router.get('/logout', function(req, res) {
  const resultData = {
    ret: 0,
    msg: '成功退出',
    data: null
  }
  res.end(JSON.stringify(resultData))
})

module.exports = router;
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const logger = require('morgan');
const FileStreamRotator = require('file-stream-rotator');
const api = require('./api/index');

const port = 3000
const logDirectory = path.join(__dirname, 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

const accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: logDirectory + '/access-%DATE%.log',
  frequency: 'daily',
  verbose: false
})

// 添加日志
app.use(logger('combined', { stream: accessLogStream }));

// 添加路由
app.use('/api', api);

// 响应头跨域设置
const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Request-Headers', 'content-Type, authorization')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
}
app.use(allowCrossDomain);

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})

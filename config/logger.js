const log4js = require('log4js');

log4js.configure({
  replaceConsole: true,
  appenders: {
    // 设置控制台输出
    console: { type: 'console' },

    // 所有日志记录，文件类型file 
    fileLog: { 
      type: "file", 
      filename: "log/file.log",
      layout: {
        type: "pattern",
          pattern: '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}'
      },
      encoding: 'utf-8',
      backups: 5,
      compress: false,
      keepFileExt: true,
    },

    // http请求日志  http请求日志需要app.use引用一下， 这样才会自动记录每次的请求信息 
    httpLog: { 
      type: "dateFile", 
      filename: "log/httpAccess.log", 
      pattern: ".yyyy-MM-dd", 
      keepFileExt: true,
      alwaysIncludePattern: true,
    },
    // 错误 
    errorLog: { 
      type: "dateFile", 
      filename: "log/error.log", 
      pattern: ".yyyy-MM-dd", 
      keepFileExt: true,
      alwaysIncludePattern: true,
    }
  },

  categories: {
    // appenders: 取上面appenders项, level:设置级别
    default: { appenders: ['console', 'fileLog'], level: 'info' },
    http: { appenders: ['httpLog'], level: "debug" },
    error: { appenders: ['errorLog'], level: "debug" },
  },
  pm2: true,
});

const consoleLog = log4js.getLogger('console');
const consoleLogger = log4js.connectLogger(consoleLog, { level: 'info' });

const httpLog = log4js.getLogger('http');
const httpLogger = log4js.connectLogger(httpLog, { level: 'warn' });

module.exports = {
  httpLogger,
  consoleLog,
  consoleLogger,
};
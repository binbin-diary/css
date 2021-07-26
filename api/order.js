const express = require('express');
const mysql = require('mysql')
const models = require('../config/db');
const { getCurrentTime } = require('../utils/common');

const router = express.Router();
const connection = mysql.createConnection(models.mysql);
connection.connect();

// 获取订单列表
router.get('/list', function(req, res) {
  let resultData = {}

  const id = req.headers['uid'].split('-')[0]
  const { page, page_size, trans_way, custom_order_no, order_no } = req.query

  const pages = page - 1
  const offsetPage = pages * page_size
  let sqls = `SELECT count(1) as total from t_order WHERE user_id = '${id}' `
  if (trans_way && trans_way !== '') {
    sqls += `and trans_way = '${trans_way}'`
  }

  if (custom_order_no && custom_order_no !== '') {
    sqls += ` and custom_order_no like '%${custom_order_no}%'`
  }

  if (order_no && order_no !== '') {
    sqls += ` and order_no = '${order_no}'`
  }

  connection.query(sqls, function(err, result) {
    if (err) {
      throw err
    }
    // 用户是否存在
    if (result == null || result.length === 0) {
      resultData = {
        ret: 1001,
        msg: '获取列表失败',
        data: null
      }
      res.end(JSON.stringify(resultData))
    } else {
      resultData = {
        ret: 0,
        msg: '获取成功',
        total: result[0].total,
        token: req.headers.authorization
      }
      let newSql = `SELECT * FROM t_order WHERE user_id = '${id}' `

      if (trans_way && trans_way !== '') {
        newSql += `and trans_way = '${trans_way}'`
      }

      if (custom_order_no && custom_order_no !== '') {
        newSql += ` and custom_order_no like '%${custom_order_no}%'`
      }

      if (order_no && order_no !== '') {
        newSql += ` and order_no = '${order_no}'`
      }
      newSql = newSql + ` ORDER BY create_time DESC limit ${offsetPage},${page_size}`
      connection.query(newSql, function(err, data) {
        if (err) {
          throw err
        }
        if (data.length > 0) {
          data.forEach(item => {
            // 1海运 2空运 3陆运 4铁运
            let trans_way_str = ''
            if (item.trans_way === 1) {
              trans_way_str = '海运'
            }
            if (item.trans_way === 2) {
              trans_way_str = '空运'
            }
            if (item.trans_way === 3) {
              trans_way_str = '陆运'
            }
            if (item.trans_way === 4) {
              trans_way_str = '铁运'
            }
            item.trans_way_str = trans_way_str
          })
        }
        resultData.data = data

        res.end(JSON.stringify(resultData))
      })
    }
  })
})

// 删除订单
router.get('/delete', function(req, res) {
  let resultData = {}

  const id = req.headers['uid'].split('-')[0]
  const { order_no } = req.query

  const sqls = `delete from t_order WHERE user_id = '${id}' and order_no = '${order_no}'`

  connection.query(sqls, function(err, result) {
    if (err) {
      throw err
    }
    // 用户是否存在
    if (result == null || result.length === 0) {
      resultData = {
        ret: 1001,
        msg: '删除失败',
        data: null
      }
      res.end(JSON.stringify(resultData))
    } else {
      resultData = {
        ret: 0,
        msg: '删除成功',
        data: result[0]
      }
      res.end(JSON.stringify(resultData))
    }
  })
})

// 修改订单
router.get('/edit', function(req, res) {
  let resultData = {}

  const id = req.headers['uid'].split('-')[0]
  const { order_no, shipping_no } = req.query

  const times = getCurrentTime()
  const sqls = `UPDATE t_order set shipping_no = '${shipping_no}', edit_time = '${times}' WHERE user_id = '${id}' and order_no = '${order_no}'`

  connection.query(sqls, function(err, result) {
    if (err) {
      throw err
    }
    // 用户是否存在
    if (result == null || result.length === 0) {
      resultData = {
        ret: 1001,
        msg: '修改失败',
        data: null
      }
      res.end(JSON.stringify(resultData))
    } else {
      resultData = {
        ret: 0,
        msg: '修改成功',
        data: result[0]
      }
      res.end(JSON.stringify(resultData))
    }
  })
})

// 新增订单
router.get('/add', function(req, res) {
  let resultData = {}

  const id = req.headers['uid'].split('-')[0]
  const { order_no, trans_way } = req.query

  // 判断order_no是否存在
  const selectOrderSql = `select * from t_order WHERE user_id = '${id}' and order_no = '${order_no}'`
  connection.query(selectOrderSql, function(err, result) {
    if (err) {
      throw err
    }
    if (result == null || result.length === 0) {
      // 查找不到，则添加
      const customOrderNo = req.query.custom_order_no ? req.query.custom_order_no : ''
      const sqls = `insert into t_order (user_id, order_no, custom_order_no, trans_way) VALUES('${id}', '${order_no}', '${customOrderNo}', '${trans_way}')`
      connection.query(sqls, function(err, result) {
        if (err) {
          throw err
        }
        resultData = {
          ret: 0,
          msg: '添加成功',
          data: null
        }
        res.end(JSON.stringify(resultData))
      })
    } else {
      resultData = {
        ret: 1002,
        msg: '订单号已存在',
        data: null
      }
      res.end(JSON.stringify(resultData))
    }
  })
})

module.exports = router;
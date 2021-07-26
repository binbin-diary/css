const express = require('express')
const bodyParser = require('body-parser')
const userRouter = require('./user');
const orderRouter = require('./order');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use((req, res, next) => {
  res.header({ 'Content-Type': 'application/json; charset=utf-8' });
  next();
})

router.use('/user', userRouter);
router.use('/order', orderRouter);

module.exports = router;

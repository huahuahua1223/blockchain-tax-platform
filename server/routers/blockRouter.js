const express = require('express');
const { getBlocks } = require('../controllers/blockController');

const router = express.Router();

// 路由来获取所有区块信息
router.get('/', getBlocks);

module.exports = router;

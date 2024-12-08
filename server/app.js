const express = require('express');
const { startBlockListener } = require('./controllers/blockController');
const blockRouter = require('./routers/blockRouter');
const app = express();
app.use(express.json()); // 中间件

// 路由
app.use('/blocks', blockRouter);

// 启动区块链监听器
startBlockListener();


const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
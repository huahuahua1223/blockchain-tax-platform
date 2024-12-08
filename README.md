# blockchain-tax-platform
## 下载依赖
npm i --legacy-peer-deps

## 编译
npm run compile
## 创建ABI符号链接
npm run postinstall
## 部署
npm run deploy

## 启动前端服务
npm run start

---

remix调用
在remix里调用`records`函数，获取备案信息的平台类型与平台ID是`Kuaishou，Taobao，Douyin`
调用`getRecordHash`函数，输入平台类型与平台ID，获取备案信息的`ID_hash`
调用`addRegulation`函数，输入`ID_hash`，收入类型是带货还是打赏，收入额，账户类型是Individual还是Company

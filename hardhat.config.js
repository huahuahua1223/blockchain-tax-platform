require("@nomicfoundation/hardhat-toolbox");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
      version: "0.8.20",
      settings: {
          optimizer: {
              enabled: true,
              runs: 200,
          },
      },
      compilers: [
        {
          version: "0.6.10",  // 支持 0.6 版本的 Solidity 文件
          settings: {
            optimizer: {
              enabled: true,
              runs: 200
            }
          }
        },
        {
          version: "0.8.20",  // 支持 0.8 版本的 Solidity 文件
          settings: {
            optimizer: {
              enabled: true,
              runs: 200
            }
          }
        }
      ]
  },
  defaultNetwork:"localhost",
  networks:{
    localhost:{
      url:"http://123.207.53.145:8545",
      chainId:20200,
      accounts:['0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80']
    }
  }
};

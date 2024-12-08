// scripts/deploy.js
const hre = require("hardhat");
const fs = require('fs');

// npx hardhat compile
// npx hardhat run .\scripts\deploy.js
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  //部署TaxAudit合约
  const ContractTaxAudit = await hre.ethers.getContractFactory("TaxAudit");
  const contractTaxAudit = await ContractTaxAudit.deploy();
  console.log("TaxAudit deployed to:", contractTaxAudit.target);

  // //部署AdminOps合约
  // const ContractAdminOps = await hre.ethers.getContractFactory("AdminOps");
  // const contractAdminOps = await ContractAdminOps.deploy();
  // console.log("AdminOps deployed to:", contractAdminOps.target);

  // // 部署ConsumeTable合约
  // const ContractConsumeTable = await hre.ethers.getContractFactory("ConsumeTable");
  // const contractConsumeTable = await ContractConsumeTable.deploy();
  // console.log("ConsumeTable deployed to:", contractConsumeTable.target);

  // // 部署EntityTable合约
  // const ContractEntityTable = await hre.ethers.getContractFactory("EntityTable");
  // const contractEntityTable = await ContractEntityTable.deploy();
  // console.log("EntityTable deployed to:", contractEntityTable.target);


  // 将所有合约地址保存到一个JSON文件中
  const contractAddresses = {
    TaxAuditAddr: contractTaxAudit.target
    // AdminOpsAddr: contractAdminOps.target,
    // ConsumeTableAddr: contractConsumeTable.target,
    // EntityTableAddr: contractEntityTable.target
  };

  fs.writeFileSync('src/contract/contract-addresses.json', JSON.stringify(contractAddresses, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });


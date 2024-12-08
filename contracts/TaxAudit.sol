// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TaxAudit {

    // 定义备案信息结构体
    struct Record {
        string id;               // 备案ID
        string name;             // 姓名
        string platformType;     // 平台类型
        string platformAccountId; // 平台账户ID
        string idCard;           // 身份证号
        string accountType;      // 账户类型
        uint256 timestamp;       // 备案时间戳
        bytes32 recordHash;      // 备案信息的Hash值（用于防篡改）
        string status;           // 备案状态，例如 "Pending", "Approved", "Rejected"
        uint256 blockHeight;     // 记录的区块高度
    }

    // 监管信息结构体
    struct RegulationInfo {
        bytes32 recordHash;      // 备案信息的Hash值
        string incomeType;       // 收入类型，例如 "Salary", "Rental", "Business"
        uint256 incomeAmount;    // 收入额
        string accountType;      // 收入账户类型
    }

    // 定义一个结构体数组来存储所有备案信息
    Record[] public records;

    // 使用mapping来存储备案ID与备案信息的映射
    mapping(string => Record) public recordMapping;

    // 映射：platformAccountId 和 platformType -> recordHash
    mapping(string => mapping(string => bytes32)) public accountPlatformToRecordHash;

     // 存储所有监管信息
    RegulationInfo[] public regulations;

    // 映射：recordHash -> 监管信息
    mapping(bytes32 => RegulationInfo) public regulationMapping;

    // 事件：新备案创建
    event RecordCreated(string recordId, string name, string platformAccountId, string status, uint256 blockHeight);

     // 事件：新增监管信息
    event RegulationAdded(bytes32 recordHash, string incomeType, uint256 incomeAmount);

    // 用于生成自增备案ID的状态变量
    uint256 private recordCounter = 0;

    // 添加备案信息函数
    function addRecord(
        string memory name, 
        string memory platformType, 
        string memory platformAccountId, 
        string memory idCard, 
        string memory accountType, 
        string memory status
    ) public {
        // 自增备案ID
        recordCounter++;

        // 生成唯一的备案ID
        string memory recordId = string(abi.encodePacked("REC", uint2str(recordCounter)));

        // 生成记录Hash，用于验证数据完整性
        bytes32 recordHash = keccak256(abi.encodePacked(recordId, name, platformType, platformAccountId, idCard, accountType, block.timestamp));

        // 获取当前区块高度
        uint256 blockHeight = block.number;

        // 创建一个新的备案信息
        Record memory newRecord = Record({
            id: recordId,
            name: name,
            platformType: platformType,
            platformAccountId: platformAccountId,
            idCard: idCard,
            accountType: accountType,
            timestamp: block.timestamp,
            recordHash: recordHash,
            status: status,
            blockHeight: blockHeight
        });

        // 将新记录添加到结构体数组中
        records.push(newRecord);

        // 将备案ID和对应的备案信息存储到mapping中
        recordMapping[recordId] = newRecord;

        // 记录 platformAccountId 和 platformType 对应的 recordHash
        accountPlatformToRecordHash[platformAccountId][platformType] = recordHash;

        // 触发备案创建事件
        emit RecordCreated(recordId, name, platformAccountId, status, blockHeight);
    }

    // 获取备案信息 by 备案ID
    function getRecordById(string memory id) public view returns (Record memory) {
        // 根据备案ID从mapping中获取备案信息
        return recordMapping[id];
    }

    // 获取备案Hash by 平台账户ID 和 平台类型
    function getRecordHash(string memory platformAccountId, string memory platformType) public view returns (bytes32) {
        return accountPlatformToRecordHash[platformAccountId][platformType];
    }

    // 添加监管信息
    function addRegulation(
        bytes32 recordHash,
        string memory incomeType,
        uint256 incomeAmount,
        string memory accountType
    ) public {
        // 创建新的监管信息
        RegulationInfo memory newRegulation = RegulationInfo({
            recordHash: recordHash,
            incomeType: incomeType,
            incomeAmount: incomeAmount,
            accountType: accountType
        });

        // 存储监管信息
        regulations.push(newRegulation);

        // 将监管信息与 recordHash 映射
        regulationMapping[recordHash] = newRegulation;

        // 触发新增监管信息事件
        emit RegulationAdded(recordHash, incomeType, incomeAmount);
    }

    // 获取监管信息 by recordHash
    function getRegulation(bytes32 recordHash) public view returns (RegulationInfo memory) {
        return regulationMapping[recordHash];
    }

    // 获取所有备案信息
    function getAllRecords() public view returns (Record[] memory) {
        return records;
    }

    // 获取所有监管信息
    function getAllRegulations() public view returns (RegulationInfo[] memory) {
        return regulations;
    }


    // 修改备案状态
    function updateRecordStatus(string memory id, string memory newStatus) public {
        // 获取对应的备案信息
        Record storage record = recordMapping[id];

        // 更新备案状态
        record.status = newStatus;

        // 同步更新数组中的记录
        for (uint i = 0; i < records.length; i++) {
            if (keccak256(abi.encodePacked(records[i].id)) == keccak256(abi.encodePacked(id))) {
                records[i].status = newStatus; // 同步更新数组中的记录
                break;
            }
        }
    }

    // 辅助函数：将uint256转换为字符串
    function uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }
        str = string(bstr);
    }
}

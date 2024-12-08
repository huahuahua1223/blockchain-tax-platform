import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Table, Button, Tooltip, message } from 'antd';
import { CopyOutlined, PlayCircleOutlined, TaobaoOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import TaxAuditABI from '../contract/ABIs/TaxAuditABI'; // 合约 ABI
import TaxAuditAddress from '../contract/ADDRESSes/TaxAuditAddress'; // 合约地址

// 自定义平台图标
const platformIcons = {
  Douyin: <VideoCameraOutlined style={{ color: '#00f2b6', marginRight: 8 }} />,
  Taobao: <TaobaoOutlined style={{ color: '#ff6a00', marginRight: 8 }} />,
  Kuaishou: <PlayCircleOutlined style={{ color: '#ffbc00', marginRight: 8 }} />,
};

const platformNames = {
  Douyin: '抖音',
  Taobao: '淘宝',
  Kuaishou: '快手',
};

const WhiteListMapping = () => {
  const [web3, setWeb3] = useState(null);
  const [contractTaxAudit, setContractTaxAudit] = useState(null);
  const [recordList, setRecordList] = useState([])
  const [IsList, setIsList] = useState(false);

  useEffect(() => {
    async function init() {
      // 连接到网络
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          // 请求用户授权
          await window.ethereum.enable();
          setWeb3(web3Instance);

          // 创建管理员实例
          const taxAuditInstance = new web3Instance.eth.Contract(
            TaxAuditABI,
            TaxAuditAddress
          );
          setContractTaxAudit(taxAuditInstance);

          getAllRecords(web3Instance,taxAuditInstance)
        } catch (error) {
          console.error(error);
        }
      } else {
        console.error('请安装浏览器插件，如 MetaMask');
      }
    }
    init();
  }, []);

  const getAllRecords = async (web3Instance, taxAuditInstance) => {
    if (taxAuditInstance) {
      try {
        // 获取当前用户的账户地址
        const accounts = await web3Instance.eth.getAccounts();
        const fromAddress = accounts[0];
        console.log("fromAddress:", fromAddress);

        // 获取当前网络的 gas price（传统 gas 模式）
        const gasPrice = await web3Instance.eth.getGasPrice(); // 获取当前网络的 gas price

        // 设置交易参数
        const txParams = {
          from: fromAddress,
          gasPrice: gasPrice, // 使用传统的 gas price
          gas: 500000, // 设定一个合理的 gas limit，具体数值根据你的合约操作而定
        };

        const result = await taxAuditInstance.methods.getAllRecords().call({ from: fromAddress });
        console.log("Returned data:", result);

        // 过滤掉状态为 'Pending' 的记录
        const filteredRecords = result.filter(record => record.status !== 'Pending');

        setRecordList(filteredRecords);
        setIsList(true);//让列表显示出来
      } catch (error) {
        console.error(error);
        message.error('查询失败！');
      }
    };
  };

  // 列表配置
  const columns = [
    {
      title: '平台ID',
      dataIndex: 'platformAccountId',
      key: 'platformAccountId',
    },
    {
      title: '平台',
      dataIndex: 'platformType',
      key: 'platformType',
      render: (platform) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* 显示图标和平台名称 */}
          {platformIcons[platform]}
          <span>{platformNames[platform]}</span>
        </div>
      ),
    },
    {
      title: 'ID_Hash',
      dataIndex: 'recordHash',
      key: 'recordHash',
      render: (text) => (
        <Tooltip title="点击复制">
          <CopyToClipboard
            text={text}
            onCopy={() => message.success('复制成功！')}
          >
            <Button
              icon={<CopyOutlined />}
              type="link"
              style={{ padding: 0, fontSize: '14px' }}
            >
              {text}
            </Button>
          </CopyToClipboard>
        </Tooltip>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>白名单映射表</h2>
      <Table
        columns={columns}
        dataSource={recordList}
        pagination={false}
        bordered
        rowKey="key"
      />
    </div>
  );
};

export default WhiteListMapping;

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Table, Button, Tooltip, message, Input, Select, DatePicker, Row, Col, Typography } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { VideoCameraOutlined, PlayCircleOutlined, TaobaoOutlined } from '@ant-design/icons';
import moment from 'moment';

import TaxAuditABI from '../contract/ABIs/TaxAuditABI'; // 合约 ABI
import TaxAuditAddress from '../contract/ADDRESSes/TaxAuditAddress'; // 合约地址

const { Option } = Select;
const { Text } = Typography;


const AnchorDetails = () => {
  const [web3, setWeb3] = useState(null);
  const [contractTaxAudit, setContractTaxAudit] = useState(null);
  const [recordList, setRecordList] = useState([])
  const [IsList, setIsList] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    platform: '',
    id: '',
    startDate: null,
    endDate: null,
    status: '',
  });

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

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
      key: 'idCard',
    },
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
          {platformIcons[platform]}
          <span>{platformNames[platform]}</span>
        </div>
      ),
    },
    {
      title: '账户类型',
      dataIndex: 'accountType',
      key: 'accountType',
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
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => {
        const date = new Date(Number(timestamp) * 1000);
        return date.toLocaleString();
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ color: status === 'Pending' ? 'orange' : 'green' }}>
          {status}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
          <Button
            type="link"
            onClick={() => handleApprove(record.id)}
          >
            审批
          </Button>
        
      ),
    },
  ];

  const getAllRecords = async (web3Instance, taxAuditInstance) => {
    if (taxAuditInstance) {
      try {
        // 获取当前用户的账户地址
        const accounts = await web3Instance.eth.getAccounts();
        const fromAddress = accounts[0];
        console.log("fromAddress:", fromAddress);

        const result = await taxAuditInstance.methods.getAllRecords().call({ from: fromAddress });
        console.log("Returned data:", result);

        setRecordList(result);
        setIsList(true);//让列表显示出来
      } catch (error) {
        console.error(error);
        message.error('查询失败！');
      }
    };
  };

  const handleApprove = async (id) => {
    if (!contractTaxAudit) return;

    try {
      const accounts = await web3.eth.getAccounts();
      const fromAddress = accounts[0];

      // 调用合约方法，更新备案状态为“已批准”
      await contractTaxAudit.methods.updateRecordStatus(id, 'Approved').send({ from: fromAddress });
      message.success('审批成功！');

      // 更新状态后重新获取记录
      getAllRecords(web3, contractTaxAudit);
    } catch (error) {
      console.error(error);
      message.error('审批失败！');
    }
  };

  const handleSearch = () => {
    // 在这里可以根据 filters 进行过滤，暂时直接返回消息模拟
    message.success('查询成功！');
  };

  const handleReset = () => {
    setFilters({
      name: '',
      platform: '',
      id: '',
      startDate: null,
      endDate: null,
      status: '',
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>已备案主播详情</h2>

      {/* 搜索筛选框 */}
      <div style={{ marginBottom: 20 }}>
        <Row gutter={16}>
          {/* 左侧搜索框区域 */}
          <Col span={22}>
            <Text style={{ display: 'block', marginBottom: 10 }}>请输入查询条件：</Text> {/* 文字描述 */}
            <Row gutter={16}>
              <Col span={8}>
                <Input
                  placeholder="姓名"
                  value={filters.name}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                />
              </Col>
              <Col span={8}>
                <Input
                  placeholder="平台ID"
                  value={filters.id}
                  onChange={(e) => setFilters({ ...filters, id: e.target.value })}
                />
              </Col>
              <Col span={8}>
                <Select
                  placeholder="选择平台"
                  value={filters.platform}
                  onChange={(value) => setFilters({ ...filters, platform: value })}
                  style={{ width: '100%' }}
                >
                  <Option value="Douyin">抖音</Option>
                  <Option value="Taobao">淘宝</Option>
                  <Option value="Kuaishou">快手</Option>
                </Select>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={8}>
                <DatePicker.RangePicker
                  value={[
                    filters.startDate ? moment(filters.startDate) : null,
                    filters.endDate ? moment(filters.endDate) : null,
                  ]}
                  onChange={(dates) => {
                    setFilters({
                      ...filters,
                      startDate: dates ? dates[0].toISOString() : null,
                      endDate: dates ? dates[1].toISOString() : null,
                    });
                  }}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={8}>
                <Select
                  placeholder="选择状态"
                  value={filters.status}
                  onChange={(value) => setFilters({ ...filters, status: value })}
                  style={{ width: '100%' }}
                >
                  <Option value="已备案">已备案</Option>
                  <Option value="待审批">待审批</Option>
                </Select>
              </Col>
            </Row>
          </Col>

          {/* 右侧按钮区域 */}
          <Col span={2}>
            <Row gutter={16}>
              <Col span={24} style={{ marginBottom: 8 }}>
                <Button type="primary" onClick={handleSearch}>
                  查询
                </Button>
              </Col>
              <Col span={24}>
                <Button onClick={handleReset}>
                  重置
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      {/* 数据表格 */}
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

export default AnchorDetails;

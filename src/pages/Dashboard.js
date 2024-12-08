import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Row, Col, Card, Statistic, Table, message, Button, Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Doughnut } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import { WalletOutlined, BarChartOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import { Chart as ChartJS, ArcElement, LineElement, PointElement, LinearScale, CategoryScale, Title, Legend } from 'chart.js';

import TaxAuditABI from '../contract/ABIs/TaxAuditABI'; // 合约 ABI
import TaxAuditAddress from '../contract/ADDRESSes/TaxAuditAddress'; // 合约地址

// 注册Chart.js的必要元素
ChartJS.register(
  ArcElement, 
  LineElement, 
  PointElement, 
  LinearScale, 
  CategoryScale, 
  Legend, 
  Title
);

const DashboardPage = () => {
  const [web3, setWeb3] = useState(null);
  const [contractTaxAudit, setContractTaxAudit] = useState(null);
  const [recordList, setRecordList] = useState([])
  const [regulationList, setRegulationList] = useState([]);
  const [IsList, setIsList] = useState(false);
  const [isListVisible, setIsListVisible] = useState(false);


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
          getAllRegulations(web3Instance, taxAuditInstance);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.error('请安装浏览器插件，如 MetaMask');
      }
    }
    init();
  }, []);

  // 模拟数据
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: '收入',
        data: [380, 350, 250, 278, 400],
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };

  const pieChartData = {
    labels: ['礼物收入', '带货收入'],
    datasets: [
      {
        data: [400, 300],
        backgroundColor: ['#0088FE', '#00C49F'],
        hoverBackgroundColor: ['#0056B3', '#009C79'],
      },
    ],
  };

  const columns = [
    // { title: '区块', dataIndex: 'blockHeight', key: 'blockHeight' },
    {
      title: '区块号',
      dataIndex: 'blockHeight',
      key: 'blockHeight',
      render: (blockHeight) => blockHeight.toString(), // 将 BigInt 转为字符串
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
    
  ];

  const regulationColumns = [
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
    { title: '收入类型', dataIndex: 'incomeType', key: 'incomeType' },
    { title: '收入额', dataIndex: 'incomeAmount', key: 'incomeAmount', render: (incomeAmount) => incomeAmount.toString(), },
    { title: '账户类型', dataIndex: 'accountType', key: 'accountType'}
  ];

  // 计算总收入和比例
  const totalIncome = pieChartData.datasets[0].data.reduce((sum, entry) => sum + entry, 0);
  const giftIncomePercentage = (pieChartData.datasets[0].data[0] / totalIncome) * 100;
  const salesIncomePercentage = (pieChartData.datasets[0].data[1] / totalIncome) * 100;

  // 自定义插件来显示总交易量在图表中心
  const centerTextPlugin = {
    id: 'centerText',
    afterDraw(chart) {
      const { ctx, chartArea: { top, bottom, left, right } } = chart;
      const width = right - left;
      const height = bottom - top;

      ctx.save();
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`交易量：${totalIncome}`, left + width / 2, top + height / 2);
      ctx.restore();
    },
  };

  const getAllRecords = async (web3Instance, taxAuditInstance) => {
    if (taxAuditInstance) {
      try {
        // 获取当前用户的账户地址
        const accounts = await web3Instance.eth.getAccounts();
        const fromAddress = accounts[0];
        console.log("fromAddress:", fromAddress);

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

  const getAllRegulations = async (web3Instance, taxAuditInstance) => {
    if (taxAuditInstance) {
      try {
        const accounts = await web3Instance.eth.getAccounts();
        const fromAddress = accounts[0];

        const regulations = await taxAuditInstance.methods.getAllRegulations().call({ from: fromAddress });
        setRegulationList(regulations);
      } catch (error) {
        console.error(error);
        message.error('查询法规失败！');
      }
    }
  };



  return (
    <div>
      {/* 总统计 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card bordered={false} hoverable>
            <Statistic title="总记账额" value={112893} precision={2} prefix="¥" />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} hoverable>
            <Statistic title="区块链交易总数" value={5000} prefix={<WalletOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} hoverable>
            <Statistic title="日新增账户" value={50} prefix={<AppstoreAddOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} hoverable>
            <Statistic title="较昨日新增" value={5} prefix={<BarChartOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* 图表展示 */}
      <div style={{ marginTop: 20 }}>
        <Row gutter={16}>
          <Col span={17}>
            <Card title="已确认交易数量" bordered={false}>
              <Line
                data={lineChartData}
                options={{
                  responsive: true,
                  plugins: {
                    tooltip: { enabled: true },
                  },
                }}
              />
            </Card>
          </Col>
          <Col span={7}>
            <Card title="类别占比" bordered={false}>
              <Doughnut
                data={pieChartData}
                options={{
                  responsive: true,
                  cutout: '70%',  // 控制环的大小，设置为70%会缩小
                  plugins: {
                    tooltip: { enabled: true },
                  },
                  plugins: [centerTextPlugin],
                }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* 表格展示 */}
      <div style={{ marginTop: 20 }}>
        <Row gutter={16}>
          <Col span={24}>
            <Card title="已备案ID_Hash" bordered={false}>
              <Table columns={columns} dataSource={recordList} />
            </Card>
          </Col>
        </Row>
      </div>

      {/* 监管列表 */}
      <div style={{ marginTop: 20 }}>
        <Row gutter={16}>
          <Col span={24}>
            <Card title="监管信息" bordered={false}>
              <Table columns={regulationColumns} dataSource={regulationList} />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DashboardPage;

// Home.js
import React from 'react';
import { Button, Layout, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { SafetyCertificateOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title } = Typography;

const Home = () => {
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      {/* Header */}
      <Header style={{ background: '#1890ff', padding: '0 24px', display: 'flex', alignItems: 'center' }}>
        <SafetyCertificateOutlined style={{ fontSize: 30, color: '#fff' }} />
        <Title level={2} style={{ color: '#fff', marginLeft: '10px', fontWeight: 'bold' }}>
          KOL 区块链税务监管平台
        </Title>
      </Header>

      {/* Main Content */}
      <Content
        style={{
          padding: '50px 24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Space direction="vertical" size="large" style={{ textAlign: 'center' }}>
          <Title level={4}>欢迎使用 KOL 区块链税务监管平台</Title>
          <div style={{ fontSize: '16px', color: '#555' }}>
            选择您的角色以继续：
          </div>

          {/* Buttons */}
          <Space direction="vertical" size="middle">
            <Button
              type="primary"
              size="large"
              style={{ width: '200px', borderRadius: '8px', fontWeight: 'bold' }}
            >
              <Link to="/user" style={{ color: '#fff', width: '100%' }}>
                进入用户界面
              </Link>
            </Button>
            <Button
              type="default"
              size="large"
              style={{
                width: '200px',
                borderRadius: '8px',
                borderColor: '#1890ff',
                fontWeight: 'bold',
                color: '#1890ff',
              }}
            >
              <Link to="/admin" style={{ color: '#1890ff', width: '100%' }}>
                进入管理员界面
              </Link>
            </Button>
          </Space>
        </Space>
      </Content>
    </Layout>
  );
};

export default Home;

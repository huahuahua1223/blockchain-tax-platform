import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams, Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, ConfigProvider } from 'antd';
import { UserOutlined, AppstoreAddOutlined, LoadingOutlined, MenuFoldOutlined, HeartOutlined, ShoppingCartOutlined, PlusOutlined, FileDoneOutlined, HomeOutlined, ShopOutlined, SafetyCertificateOutlined, HistoryOutlined } from '@ant-design/icons';
import { lightTheme, darkTheme } from './theme'; // 引入主题配置
import { ConnectButton } from '@rainbow-me/rainbowkit';

import Dashboard from './pages/Dashboard'; // 例如：仪表盘页面
import UserManagement from './pages/UserManagement'; // 用户管理页面
import TaxReports from './pages/TaxReports'; // 税务报告页面
import NotFoundPage from './pages/NotFoundPage'; // 404 页面
import Home from './pages/Home'; // 主页
import KYCBRegistration from './pages/KYCBRegistration'; // KYCB备案申请表
import WhiteListMapping from './pages/WhiteListMapping'; // 白名单映射表
import AnchorDetails from './pages/AnchorDetails'; // 已备案主播详情

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

// 用户界面 Layout
const UserLayout = ({ toggleTheme, isDarkMode }) => {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: 'var(--primary-header-bg)', padding: 0, display: 'flex', alignItems: 'center' }}>
        <SafetyCertificateOutlined style={{ fontSize: 24, color: '#1890ff' }} />
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff', marginLeft: '10px' }}>
          KOL 区块链税务监管平台 (用户)
        </div>
        <Button
          onClick={toggleTheme}
          style={{ marginLeft: 'auto', backgroundColor: 'transparent', color: 'var(--primary-text-color)' }}
        >
          {isDarkMode ? '切换到日间模式' : '切换到夜间模式'}
        </Button>
        <ConnectButton />
      </Header>
      <Layout>
        <Sider width={200} style={{ background: 'var(--primary-bg-color)' }}>
          <Menu theme={isDarkMode ? 'dark' : 'light'} mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="home" icon={<HomeOutlined />} onClick={() => navigate('/')}>
              回到主界面
            </Menu.Item>
            <Menu.Item key="1" icon={<UserOutlined />}>
              <Link to="/user/">工作台</Link>
            </Menu.Item>
            <Menu.Item key="kycb-registration" icon={<FileDoneOutlined />}>
              <Link to="/user/kycb-registration">KYCB备案申请表</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<ShoppingCartOutlined />}>
              <Link to="/user/user-management">管理用户</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<FileDoneOutlined />}>
              <Link to="/user/tax-reports">查看报告</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="/tax-reports" element={<TaxReports />} />
              <Route path="/kycb-registration" element={<KYCBRegistration />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
};

// 管理员界面 Layout
const AdminLayout = ({ toggleTheme, isDarkMode }) => {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: 'var(--primary-header-bg)', padding: 0, display: 'flex', alignItems: 'center' }}>
        <SafetyCertificateOutlined style={{ fontSize: 24, color: '#1890ff' }} />
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff', marginLeft: '10px' }}>
          KOL 区块链税务监管平台 (管理员)
        </div>
        <Button
          onClick={toggleTheme}
          style={{ marginLeft: 'auto', backgroundColor: 'transparent', color: 'var(--primary-text-color)' }}
        >
          {isDarkMode ? '切换到日间模式' : '切换到夜间模式'}
        </Button>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: 'var(--primary-bg-color)' }}>
          <Menu theme={isDarkMode ? 'dark' : 'light'} mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="home" icon={<HomeOutlined />} onClick={() => navigate('/')}>
              回到主界面
            </Menu.Item>
            <Menu.Item key="1" icon={<AppstoreAddOutlined />}>
              <Link to="/admin/">管理员首页</Link>
            </Menu.Item>
            <SubMenu key="registered-address-book" icon={<HistoryOutlined />} title="已备案地址簿">
              <Menu.Item key="registered-address-1">
                <Link to="/admin/registered-address-details">已备案主播详情</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="mapping-table" icon={<AppstoreAddOutlined />} title="映射表">
              <Menu.Item key="mapping-table-1">
                <Link to="/admin/whitelist-mapping">白名单映射表</Link>
              </Menu.Item>
            </SubMenu>
            {/* <Menu.Item key="kycb-registration" icon={<FileDoneOutlined />}>
              <Link to="/admin/kycb-registration">KYCB备案申请表</Link>
            </Menu.Item> */}
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
            <Routes>
              <Route path="/" element={<div>管理员仪表盘</div>} />
              <Route path="/registered-address-details" element={<AnchorDetails />} />
              <Route path="/whitelist-mapping" element={<WhiteListMapping />} />
              {/* <Route path="/kycb-registration" element={<KYCBRegistration />} /> */}
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
};

const AppRouter = ({ currentAccount, currentNetwork }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.style.setProperty('--primary-bg-color', '#1a1a1a');
      document.body.style.setProperty('--primary-text-color', '#fff');
      document.body.style.setProperty('--primary-header-bg', '#333');
    } else {
      document.body.style.setProperty('--primary-bg-color', '#fff');
      document.body.style.setProperty('--primary-text-color', '#000');
      document.body.style.setProperty('--primary-header-bg', '#f0f2f5');
    }
  }, [isDarkMode]);

  return (
    <ConfigProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/*" element={<UserLayout toggleTheme={toggleTheme} isDarkMode={isDarkMode} />} />
        <Route path="/admin/*" element={<AdminLayout toggleTheme={toggleTheme} isDarkMode={isDarkMode} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ConfigProvider>
  );
};

export default AppRouter;
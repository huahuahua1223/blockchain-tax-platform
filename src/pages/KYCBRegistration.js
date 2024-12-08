import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Form, Input, Button, Select, message, Row, Col } from 'antd';
import { UserOutlined, IdcardOutlined } from '@ant-design/icons';

import TaxAuditABI from '../contract/ABIs/TaxAuditABI'; // 合约 ABI
import TaxAuditAddress from '../contract/ADDRESSes/TaxAuditAddress'; // 合约地址

const { Option } = Select;

const KYCBRegistration = () => {
  const [web3, setWeb3] = useState(null);
  const [contractTaxAudit, setContractTaxAudit] = useState(null);

  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

        } catch (error) {
          console.error(error);
        }
      } else {
        console.error('请安装浏览器插件，如 MetaMask');
      }
    }
    init();
  }, []);
  // 提交表单
  const onFinish = async (values) => {
    setIsSubmitting(true);
    if (contractTaxAudit) {
      try {
        // 获取当前用户的账户地址
        const accounts = await web3.eth.getAccounts();
        const fromAddress = accounts[0];
        console.log("fromAddress:", fromAddress, "Input:", values);

        // 调用管理员合约的 addEntity 函数
        await contractTaxAudit.methods.addRecord(values.name, values.platform, values.platformAccount, values.idCard, values.accountType, "Pending").send({ from: fromAddress });

        message.success('KYCB 备案申请表提交成功！');
        form.resetFields();
      } catch (error) {
        console.log("error", error)
        message.error('提交失败，请重试');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <div style={{ width: '100%', maxWidth: 600, padding: 20, background: '#fff', borderRadius: 8, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 20 }}>KYCB备案申请表</h2>
        <Form
          form={form}
          onFinish={onFinish}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={{
            platform: 'Douyin', // 默认平台选择
            accountType: 'Individual', // 默认账户类型
          }}
        >
          {/* 姓名输入框 */}
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入姓名" />
          </Form.Item>

          {/* 平台选择 */}
          <Form.Item
            label="平台"
            name="platform"
            rules={[{ required: true, message: '请选择平台' }]}
          >
            <Select placeholder="请选择平台">
              <Option value="Douyin">抖音</Option>
              <Option value="Taobao">淘宝</Option>
              <Option value="Kuaishou">快手</Option>
            </Select>
          </Form.Item>

          {/* 平台账号 */}
          <Form.Item
            label="平台账号"
            name="platformAccount"
            rules={[{ required: true, message: '请输入平台账号' }]}
          >
            <Input placeholder="请输入平台账号" />
          </Form.Item>

          {/* 身份证号 */}
          <Form.Item
            label="身份证号"
            name="idCard"
            rules={[{ required: true, message: '请输入身份证号' }]}
          >
            <Input prefix={<IdcardOutlined />} placeholder="请输入身份证号" />
          </Form.Item>

          {/* 账户类型选择 */}
          <Form.Item
            label="账户类型"
            name="accountType"
            rules={[{ required: true, message: '请选择账户类型' }]}
          >
            <Select placeholder="请选择账户类型">
              <Option value="Individual">个人</Option>
              <Option value="Company">公司</Option>
            </Select>
          </Form.Item>

          {/* 提交按钮 */}
          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              style={{ width: '100%' }}
            >
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default KYCBRegistration;

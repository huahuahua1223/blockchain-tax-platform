import React from 'react';
import { Table, Card } from 'antd';

const UserManagementPage = () => {
  const data = [
    { key: '1', username: '李明', role: '管理员', email: 'liming@example.com' },
    { key: '2', username: '王磊', role: '普通用户', email: 'wanglei@example.com' },
    { key: '3', username: '张亮', role: '普通用户', email: 'zhangliang@example.com' },
  ];

  const columns = [
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '角色', dataIndex: 'role', key: 'role' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
  ];

  return (
    <Card title="用户管理">
      <Table columns={columns} dataSource={data} />
    </Card>
  );
};

export default UserManagementPage;

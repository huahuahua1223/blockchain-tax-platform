import React from 'react';
import { Card, Table } from 'antd';

const TaxReportsPage = () => {
  const data = [
    { key: '1', reportName: '2024 Q1 税务报告', generatedAt: '2024-04-01', status: '已完成' },
    { key: '2', reportName: '2024 Q2 税务报告', generatedAt: '2024-07-01', status: '待处理' },
  ];

  const columns = [
    { title: '报告名称', dataIndex: 'reportName', key: 'reportName' },
    { title: '生成时间', dataIndex: 'generatedAt', key: 'generatedAt' },
    { title: '状态', dataIndex: 'status', key: 'status' },
  ];

  return (
    <Card title="税务报告">
      <Table columns={columns} dataSource={data} />
    </Card>
  );
};

export default TaxReportsPage;

import React, { useState } from 'react';
import { Card, Table, Tag, Button, Modal, Form, Input, InputNumber, Tabs, Row, Col, Space, Alert, message, Tooltip } from 'antd';
import {
  LineChartOutlined,
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import { CORRIDORS_DATA, DIVISIONS } from '../mock/apiData';

export const COADatabasePage = ({ userRole }) => {
  const [corridors, setCorridors] = useState(CORRIDORS_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  const isReadOnly = userRole === 'Viewer';

  // Goods forecast chart data
  const goodsForecastData = [
    { hour: '00:00 - 04:00', trainCount: 18 },
    { hour: '04:00 - 08:00', trainCount: 8 },
    { hour: '08:00 - 12:00', trainCount: 4 },
    { hour: '12:00 - 16:00', trainCount: 6 },
    { hour: '16:00 - 20:00', trainCount: 12 },
    { hour: '20:00 - 24:00', trainCount: 14 },
  ];

  const handleOpenModal = (record = null) => {
    setEditingItem(record);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSaveCorridor = (values) => {
    if (editingItem) {
      setCorridors(corridors.map(c => c.key === editingItem.key ? { ...c, ...values } : c));
      message.success(`Updated corridor ${editingItem.id}`);
    } else {
      const newCorridor = {
        key: String(corridors.length + 1),
        id: `COR-0${corridors.length + 1}`,
        ...values,
        status: 'Active',
        lastInspected: new Date().toISOString().split('T')[0]
      };
      setCorridors([...corridors, newCorridor]);
      message.success(`Created corridor ${newCorridor.id}`);
    }
    setIsModalOpen(false);
  };

  const corridorColumns = [
    { title: 'Corridor ID', dataIndex: 'id', key: 'id', render: id => <strong style={{ fontFamily: 'monospace' }}>{id}</strong> },
    { title: 'Corridor Name', dataIndex: 'name', key: 'name', render: name => <span style={{ fontWeight: 600 }}>{name}</span> },
    { title: 'Section / Territory', dataIndex: 'section', key: 'section' },
    { title: 'Division', dataIndex: 'division', key: 'division', render: d => <Tag color="blue">{d}</Tag> },
    { 
      title: 'Availability Score', 
      dataIndex: 'availabilityScore', 
      key: 'availabilityScore',
      render: score => (
        <Tag color={score > 0.85 ? 'success' : score > 0.70 ? 'warning' : 'error'} style={{ fontWeight: 700 }}>
          {(score * 100).toFixed(0)}%
        </Tag>
      ) 
    },
    { title: 'Passenger Trains', dataIndex: 'passengerTrainCount', key: 'passengerTrainCount' },
    { title: 'Goods Forecast', dataIndex: 'goodsForecastCount', key: 'goodsForecastCount' },
    { title: 'Traffic Window Slot', dataIndex: 'trafficWindowSlot', key: 'trafficWindowSlot', render: tw => <Tag color="purple">{tw}</Tag> },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button size="small" icon={<EditOutlined />} disabled={isReadOnly} onClick={() => handleOpenModal(record)}>
          Configure
        </Button>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <LineChartOutlined style={{ color: '#0284c7' }} /> COA Database & Corridor Availability Manager
          </h1>
          <p style={{ color: 'var(--ir-text-sub)', margin: 0, fontSize: 13 }}>
            Control Office Application (COA) live timetable feeds, freight forecasts, and corridor availability windows
          </p>
        </div>

        <Space>
          <Button type="primary" icon={<PlusOutlined />} disabled={isReadOnly} onClick={() => handleOpenModal()}>
            Add Corridor Config
          </Button>
        </Space>
      </div>

      <Tabs
        type="card"
        items={[
          {
            key: 'corridors',
            label: '1. Corridors & Track Availability',
            children: (
              <Card bodyStyle={{ padding: 16 }} style={{ borderRadius: 10, border: '1px solid var(--ir-border)' }}>
                <Table
                  columns={corridorColumns}
                  dataSource={corridors}
                  rowKey="key"
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                />
              </Card>
            )
          },
          {
            key: 'timetable',
            label: '2. Live Timetable Feeds',
            children: (
              <Card style={{ borderRadius: 10, border: '1px solid var(--ir-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <Alert message="Live COA Passenger Master Timetable Feed Active" type="info" showIcon />
                  <Button icon={<UploadOutlined />} disabled={isReadOnly}>Upload CSV Timetable Update</Button>
                </div>
                <Table
                  size="small"
                  pagination={{ pageSize: 6 }}
                  columns={[
                    { title: 'Train No.', dataIndex: 'number', key: 'number', render: t => <strong>{t}</strong> },
                    { title: 'Train Name', dataIndex: 'name', key: 'name' },
                    { title: 'Origin -> Destination', dataIndex: 'route', key: 'route' },
                    { title: 'Scheduled Section Time', dataIndex: 'time', key: 'time' },
                    { title: 'Frequency', dataIndex: 'freq', key: 'freq' },
                  ]}
                  dataSource={[
                    { number: '12004', name: 'Kalka Shatabdi', route: 'NDLS -> KLK', time: '06:00 - 09:15', freq: 'Daily' },
                    { number: '12424', name: 'Dibrugarh Rajdhani', route: 'NDLS -> DBRG', time: '16:20 - 07:00 (+1)', freq: 'Daily' },
                    { number: '12260', name: 'Sealdah Duronto', route: 'NDLS -> SDAH', time: '19:45 - 12:30 (+1)', freq: 'Tue, Fri' },
                    { number: '14206', name: 'Ayodhya Express', route: 'DLI -> AY', time: '18:20 - 07:15 (+1)', freq: 'Daily' },
                  ]}
                  rowKey="number"
                />
              </Card>
            )
          },
          {
            key: 'goods',
            label: '3. Freight & Goods Forecast',
            children: (
              <Row gutter={[20, 20]}>
                <Col xs={24} md={12}>
                  <Card title="Diurnal Goods Train Density (Corridor Block Slot Selection)" style={{ borderRadius: 10 }}>
                    <div style={{ height: 240 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={goodsForecastData}>
                          <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                          <YAxis />
                          <RechartsTooltip />
                          <Bar dataKey="trainCount" fill="#0284c7" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} md={12}>
                  <Card title="Freight Schedule Manual Adjustments" style={{ borderRadius: 10 }}>
                    <Alert
                      type="warning"
                      showIcon
                      message="Low Density Corridor Window Identified"
                      description="Traffic analysis indicates 02:00 - 06:00 window has lowest freight density (average 4 trains/hr). Ideal for joint block maintenance."
                      style={{ marginBottom: 16 }}
                    />
                    <Button block icon={<UploadOutlined />} disabled={isReadOnly}>
                      Upload FOIS Freight Forecast Feed
                    </Button>
                  </Card>
                </Col>
              </Row>
            )
          }
        ]}
      />

      {/* Add / Edit Corridor Modal */}
      <Modal
        title={editingItem ? `Configure Corridor: ${editingItem.name}` : 'Add New Corridor Configuration'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveCorridor}>
          <Form.Item name="name" label="Corridor Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. NDLS - CNB Quad Line" />
          </Form.Item>

          <Form.Item name="section" label="Geographical Section Description" rules={[{ required: true }]}>
            <Input placeholder="e.g. New Delhi to Kanpur Central Main" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="division" label="Division" rules={[{ required: true }]}>
                <Input placeholder="DLI" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="availabilityScore"
                label="Availability Score (0.00 - 1.00)"
                rules={[{ required: true }]}
                tooltip="Constrained probability factor between 0.0 and 1.0"
              >
                <InputNumber min={0} max={1} step={0.01} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="trafficWindowSlot" label="Default Low-Traffic Window Slot" rules={[{ required: true }]}>
            <Input placeholder="e.g. 02:00 - 06:00" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

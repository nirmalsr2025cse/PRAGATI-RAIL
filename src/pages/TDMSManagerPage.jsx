import React, { useState } from 'react';
import { Card, Table, Tag, Button, Tabs, Space, Progress } from 'antd';
import { BlockOutlined, PlusOutlined, SendOutlined } from '@ant-design/icons';
import { useRegion } from '../context/RegionContext';
import { AddDefectModal } from '../components/common/AddDefectModal';
import { SendBlockRequestModal } from '../components/common/SendBlockRequestModal';

export const TDMSManagerPage = () => {
  const { filteredDefects } = useRegion();
  const [activeTab, setActiveTab] = useState('Pending');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [sendBlockModalOpen, setSendBlockModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filter defects for TDMS Traction OHE Department
  const tdmsDefects = filteredDefects.filter(d => d.department === 'TDMS');

  const filterByStatus = (statusKey) => {
    switch (statusKey) {
      case 'Pending': return tdmsDefects.filter(d => d.status.includes('Pending') || d.status.includes('Emergency'));
      case 'Approved': return tdmsDefects.filter(d => d.status.includes('Approved') || d.status.includes('Merged'));
      case 'Rejected': return tdmsDefects.filter(d => d.status.includes('Rejected'));
      case 'Not Yet Sent': return tdmsDefects.filter(d => d.status.includes('Draft') || d.status.includes('Local'));
      default: return tdmsDefects;
    }
  };

  const columns = [
    { title: 'Defect ID', dataIndex: 'id', key: 'id', render: text => <strong style={{ fontFamily: 'monospace' }}>{text}</strong> },
    { title: 'OHE Asset Structure', dataIndex: 'assetId', key: 'assetId', render: a => <Tag color="purple">{a || 'OHE-Mast-142/08'}</Tag> },
    { title: 'Traction Fault Type', dataIndex: 'defectType', key: 'defectType', render: t => <strong style={{ color: '#7c3aed' }}>{t}</strong> },
    { title: 'Location / Mast', dataIndex: 'location', key: 'location' },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: s => <Tag color={s === 'Critical' ? 'red' : s === 'High' ? 'orange' : 'blue'}>{s}</Tag>
    },
    {
      title: 'AI Priority Score',
      dataIndex: 'priorityScore',
      key: 'priorityScore',
      render: score => <Progress percent={score || 88} size="small" strokeColor={score > 80 ? '#dc2626' : '#059669'} />
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: st => <Tag color={st.includes('Approved') ? 'blue' : st.includes('Merged') ? 'green' : 'gold'}>{st}</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          size="small"
          type="primary"
          icon={<SendOutlined />}
          style={{ background: '#059669', borderColor: '#059669' }}
          onClick={() => {
            setSelectedItem(record);
            setSendBlockModalOpen(true);
          }}
        >
          Request Power Block
        </Button>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <BlockOutlined style={{ color: '#7c3aed' }} /> TDMS — Traction Distribution OHE Manager
          </h1>
          <p style={{ color: 'var(--ir-text-sub)', margin: 0, fontSize: 13 }}>
            Official CRIS TDMS Protocol: 25 kV AC OHE wires, insulators, neutral sections, and tower wagon power block management
          </p>
        </div>

        <Button type="primary" icon={<PlusOutlined />} style={{ background: '#7c3aed', borderColor: '#7c3aed' }} onClick={() => setAddModalOpen(true)}>
          LOG NEW OHE TRACTION DEFECT
        </Button>
      </div>

      <Card style={{ borderRadius: 10, border: '1px solid var(--ir-border)' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'Pending', label: `Pending Power Blocks (${filterByStatus('Pending').length})` },
            { key: 'Not Yet Sent', label: `Not Yet Sent Drafts (${filterByStatus('Not Yet Sent').length})` },
            { key: 'Approved', label: `Approved Blocks (${filterByStatus('Approved').length})` },
            { key: 'Rejected', label: `Rejected Requests (${filterByStatus('Rejected').length})` }
          ]}
        />

        <Table
          columns={columns}
          dataSource={filterByStatus(activeTab)}
          rowKey="id"
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      <AddDefectModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
      <SendBlockRequestModal open={sendBlockModalOpen} onClose={() => setSendBlockModalOpen(false)} targetItem={selectedItem} />
    </div>
  );
};

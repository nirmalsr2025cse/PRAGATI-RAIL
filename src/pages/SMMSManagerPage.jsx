import React, { useState } from 'react';
import { Card, Table, Tag, Button, Tabs, Space, Progress, Tooltip, Badge } from 'antd';
import { ThunderboltOutlined, PlusOutlined, SendOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, MergeCellsOutlined } from '@ant-design/icons';
import { useRegion } from '../context/RegionContext';
import { AddDefectModal } from '../components/common/AddDefectModal';
import { SendBlockRequestModal } from '../components/common/SendBlockRequestModal';

export const SMMSManagerPage = () => {
  const { filteredDefects } = useRegion();
  const [activeTab, setActiveTab] = useState('Pending');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [sendBlockModalOpen, setSendBlockModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filter defects for SMMS Signal Department
  const smmsDefects = filteredDefects.filter(d => d.department === 'SMMS');

  const filterByStatus = (statusKey) => {
    switch (statusKey) {
      case 'Pending': return smmsDefects.filter(d => d.status.includes('Pending') || d.status.includes('Emergency'));
      case 'Approved': return smmsDefects.filter(d => d.status.includes('Approved') || d.status.includes('Merged'));
      case 'Rejected': return smmsDefects.filter(d => d.status.includes('Rejected'));
      case 'Not Yet Sent': return smmsDefects.filter(d => d.status.includes('Draft') || d.status.includes('Local'));
      default: return smmsDefects;
    }
  };

  const columns = [
    { title: 'Defect ID', dataIndex: 'id', key: 'id', render: text => <strong style={{ fontFamily: 'monospace' }}>{text}</strong> },
    { title: 'Signalling Asset', dataIndex: 'assetId', key: 'assetId', render: a => <Tag color="gold">{a || 'Signal S-BCN-01'}</Tag> },
    { title: 'Fault Category', dataIndex: 'defectType', key: 'defectType', render: t => <strong style={{ color: '#d97706' }}>{t}</strong> },
    { title: 'Corridor Location', dataIndex: 'location', key: 'location' },
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
      render: score => <Progress percent={score || 85} size="small" strokeColor={score > 80 ? '#dc2626' : '#059669'} />
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
          Request Block
        </Button>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <ThunderboltOutlined style={{ color: '#d97706' }} /> SMMS — Signal & Telecom Maintenance Manager
          </h1>
          <p style={{ color: 'var(--ir-text-sub)', margin: 0, fontSize: 13 }}>
            Official CRIS SMMS Protocol: Point machines, track circuits, relays, and interlocking disconnection compliance
          </p>
        </div>

        <Button type="primary" icon={<PlusOutlined />} style={{ background: '#d97706', borderColor: '#d97706' }} onClick={() => setAddModalOpen(true)}>
          LOG NEW SIGNAL DEFECT
        </Button>
      </div>

      <Card style={{ borderRadius: 10, border: '1px solid var(--ir-border)' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'Pending', label: `Pending Disconnection Blocks (${filterByStatus('Pending').length})` },
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

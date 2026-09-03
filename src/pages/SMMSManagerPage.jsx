import React, { useState } from 'react';
import { Card, Table, Tag, Button, Tabs, Space, Progress, Drawer, Descriptions, Divider, Alert, Row, Col } from 'antd';
import { ThunderboltOutlined, PlusOutlined, SendOutlined, EyeOutlined, RobotOutlined, WarningOutlined, SafetyCertificateOutlined, ToolOutlined, BlockOutlined } from '@ant-design/icons';
import { useRegion } from '../context/RegionContext';
import { AddDefectModal } from '../components/common/AddDefectModal';
import { SendBlockRequestModal } from '../components/common/SendBlockRequestModal';

export const SMMSManagerPage = () => {
  const { filteredDefects } = useRegion();
  const [activeTab, setActiveTab] = useState('Pending');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [sendBlockModalOpen, setSendBlockModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedDetailRecord, setSelectedDetailRecord] = useState(null);

  // Filter defects for SMMS Signal & Telecom Department
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
    {
      title: 'Defect ID',
      dataIndex: 'Defect_ID',
      key: 'Defect_ID',
      render: (text, record) => (
        <strong style={{ fontFamily: 'monospace', color: '#1e3a8a' }}>
          {text || record.id}
        </strong>
      )
    },
    {
      title: 'Signalling Asset',
      dataIndex: 'Asset_ID',
      key: 'Asset_ID',
      render: (a, record) => <Tag color="gold">{a || record.assetId || 'SIG-PT-102B'}</Tag>
    },
    {
      title: 'Fault Category',
      dataIndex: 'Defect_Type',
      key: 'Defect_Type',
      render: (t, record) => <strong style={{ color: '#d97706' }}>{t || record.defectType}</strong>
    },
    {
      title: 'Signalling System Info',
      key: 'signallingSystem',
      render: (_, r) => (
        <div style={{ fontSize: 11, lineHeight: 1.4 }}>
          <div>Power: <strong>{r.Power_Supply_Type || '110V AC Signalling Power'}</strong></div>
          <div>Interlocking: <strong>{r.Interlocking_Type || 'Electronic Interlocking (EI)'}</strong></div>
        </div>
      )
    },
    {
      title: 'Comm Link Status',
      dataIndex: 'Communication_Link_Status',
      key: 'Communication_Link_Status',
      render: status => {
        const st = status || 'Degraded';
        const color = st === 'Healthy' ? 'success' : st === 'Degraded' ? 'warning' : 'error';
        return <Tag color={color}>● {st}</Tag>;
      }
    },
    {
      title: 'Severity',
      dataIndex: 'Severity_Level',
      key: 'Severity_Level',
      render: (s, record) => {
        const sev = s || record.severity || 'High';
        return <Tag color={sev === 'Critical' ? 'red' : sev === 'High' ? 'orange' : 'blue'}>{sev}</Tag>;
      }
    },
    {
      title: 'Simulated AI Priority',
      dataIndex: 'Priority_Score',
      key: 'Priority_Score',
      render: (score, record) => {
        const pScore = score || record.priorityScore || 85;
        return <Progress percent={pScore} size="small" strokeColor={pScore > 80 ? '#dc2626' : '#059669'} />;
      }
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
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedDetailRecord(record);
              setDetailDrawerOpen(true);
            }}
          >
            Details
          </Button>
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
            Request Disconnection
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <ThunderboltOutlined style={{ color: '#d97706' }} /> SMMS — Signal &amp; Telecom Maintenance Manager
          </h1>
          <p style={{ color: 'var(--ir-text-sub)', margin: 0, fontSize: 13 }}>
            Official CRIS SMMS Protocol: Point machines, track circuits, signals, Electronic Interlocking (EI), &amp; disconnection block management
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

      {/* Comprehensive 40-Field SMMS Defect Inspector & AI Analytics Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#d97706' }}>
            <ThunderboltOutlined />
            <span>SMMS Signalling Telemetry &amp; Decision-Support: {selectedDetailRecord?.Defect_ID || selectedDetailRecord?.id}</span>
          </div>
        }
        placement="right"
        width={620}
        onClose={() => setDetailDrawerOpen(false)}
        open={detailDrawerOpen}
      >
        {selectedDetailRecord && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Alert Header */}
            <Alert
              type="info"
              showIcon
              message="CRIS SMMS RECORD &amp; AI DECISION-SUPPORT ADVISORY"
              description="Observed signalling power, interlocking, and comm link diagnostics are stored directly from SMMS remote diagnostic logs. Risk scores represent simulated AI decision-support results."
              style={{ fontSize: 12 }}
            />

            {/* SECTION 1: SIGNALLING SYSTEM & INTERLOCKING */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#d97706', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.5px' }}>
                1. Signalling System &amp; Interlocking Diagnostics
              </div>
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="Power Supply Type">
                  <strong>{selectedDetailRecord.Power_Supply_Type || '110V AC Signalling Power'}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Interlocking Type">
                  <strong>{selectedDetailRecord.Interlocking_Type || 'Electronic Interlocking (EI)'}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Comm Link Status">
                  <Tag color={selectedDetailRecord.Communication_Link_Status === 'Healthy' ? 'success' : selectedDetailRecord.Communication_Link_Status === 'Degraded' ? 'warning' : 'error'}>
                    ● {selectedDetailRecord.Communication_Link_Status || 'Degraded'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Detection Method">
                  {selectedDetailRecord.Detection_Method || 'Remote Diagnostic System (SSI Log)'}
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* SECTION 2: ASSET HEALTH & MAINTENANCE HISTORY */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.5px' }}>
                2. Signalling Asset Health &amp; Maintenance Context
              </div>
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="Asset ID">{selectedDetailRecord.Asset_ID || selectedDetailRecord.assetId || 'SIG-PT-102B'}</Descriptions.Item>
                <Descriptions.Item label="Asset Type">{selectedDetailRecord.Asset_Type || 'Point Machine'}</Descriptions.Item>
                <Descriptions.Item label="Asset Age">{selectedDetailRecord.Asset_Age_Years ? `${selectedDetailRecord.Asset_Age_Years} Years` : '6.5 Years'}</Descriptions.Item>
                <Descriptions.Item label="Last Maintenance">{selectedDetailRecord.Last_Maintenance_Date || '2026-05-15'}</Descriptions.Item>
                <Descriptions.Item label="Maintenance Frequency">{selectedDetailRecord.Maintenance_Frequency_Days ? `${selectedDetailRecord.Maintenance_Frequency_Days} Days` : '60 Days'}</Descriptions.Item>
                <Descriptions.Item label="Historical Failures">{selectedDetailRecord.Historical_Failure_Count ?? 2} Failures</Descriptions.Item>
                <Descriptions.Item label="Overdue Days" span={2}>
                  <Tag color={selectedDetailRecord.Overdue_Days > 0 ? 'red' : 'green'}>{selectedDetailRecord.Overdue_Days ?? 3} Overdue Days</Tag>
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* SECTION 3: LOCATION & OPERATIONAL CONTEXT */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#1e3a8a', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.5px' }}>
                3. Section Location &amp; Operational Context
              </div>
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="Section ID">{selectedDetailRecord.Section_ID || 'SEC-NDLS-CNB-DN'}</Descriptions.Item>
                <Descriptions.Item label="Chainage">{selectedDetailRecord.Chainage_KM ? `${selectedDetailRecord.Chainage_KM} km` : '142.100 km'}</Descriptions.Item>
                <Descriptions.Item label="Section Stations" span={2}>
                  {selectedDetailRecord.Station1 || 'Lucknow JN'} → {selectedDetailRecord.Station2 || 'Kanpur Central'}
                </Descriptions.Item>
                <Descriptions.Item label="Traffic Density">{selectedDetailRecord.Section_Traffic_Density || 'HIGH (44 Trains/Day)'}</Descriptions.Item>
                <Descriptions.Item label="Available Window">{selectedDetailRecord.Available_Block_Window_Hours ? `${selectedDetailRecord.Available_Block_Window_Hours} Hours` : '4.0 Hours'}</Descriptions.Item>
                <Descriptions.Item label="Corridor Criticality" span={2}>
                  <Tag color="volcano">{selectedDetailRecord.Corridor_Criticality || 'Critical High-Density Quad Corridor'}</Tag>
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* SECTION 4: INTER-DEPARTMENTAL JOINT BLOCK REQUESTS */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#059669', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.5px' }}>
                4. Joint Block Inter-Departmental Coordination
              </div>
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Overlapping Engineering (TMS) Request">
                  <Tag color="blue">{selectedDetailRecord.Overlapping_Engineering_Request || 'TRK-2026-081 (USFD Rail Flaw Weld)'}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Overlapping Traction (TDMS) Request">
                  <Tag color="purple">{selectedDetailRecord.Overlapping_TRD_Request || 'TRC-2026-031 (OHE Insulator Breakdown)'}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Block Conflict Type">
                  <Tag color="geekblue">{selectedDetailRecord.Block_Conflict_Type || 'Overlapping Disconnection & Power Block'}</Tag>
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* SECTION 5: SIMULATED AI PREDICTIVE ANALYTICS & DECISION RESULTS */}
            <Card
              size="small"
              title={
                <span style={{ color: '#059669', fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <RobotOutlined /> SIMULATED AI ANALYTICS &amp; PREDICTION RESULTS
                </span>
              }
              style={{ background: 'rgba(5, 150, 105, 0.04)', border: '1px solid #059669', borderRadius: 8 }}
            >
              <Row gutter={[12, 12]}>
                <Col span={12}>
                  <div style={{ fontSize: 11, color: 'var(--ir-text-sub)' }}>Priority Score</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#dc2626' }}>
                    {selectedDetailRecord.Priority_Score || 85} / 100
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: 11, color: 'var(--ir-text-sub)' }}>Predicted Resolution Time</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#059669' }}>
                    {selectedDetailRecord.Predicted_Resolution_Time_Hours ? `${selectedDetailRecord.Predicted_Resolution_Time_Hours} Hours` : '3.0 Hours'}
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: 11, color: 'var(--ir-text-sub)' }}>Joint Block Feasibility</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#0284c7' }}>
                    {selectedDetailRecord.Joint_Block_Feasibility_Score ? `${selectedDetailRecord.Joint_Block_Feasibility_Score}%` : '91.0%'}
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: 11, color: 'var(--ir-text-sub)' }}>Recommended Block Duration</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#7c3aed' }}>
                    {selectedDetailRecord.Recommended_Block_Duration_Hours ? `${selectedDetailRecord.Recommended_Block_Duration_Hours} Hours` : '3.0 Hours'}
                  </div>
                </Col>
                <Col span={24}>
                  <div style={{ fontSize: 11, color: 'var(--ir-text-sub)' }}>Risk If Delayed</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#dc2626', marginTop: 2 }}>
                    {selectedDetailRecord.Risk_If_Delayed || 'High Risk of Point Indication Failure causing Signal Blanking & Corridor Delays'}
                  </div>
                </Col>
                <Col span={24}>
                  <Divider style={{ margin: '8px 0' }} />
                  <div style={{ fontSize: 11, color: 'var(--ir-text-sub)' }}>Recommended Joint Block Decision</div>
                  <Tag color="green" style={{ fontWeight: 700, marginTop: 4 }}>
                    {selectedDetailRecord.Joint_Block_Recommendation || 'RECOMMENDED (Coordinate Disconnection Block with TMS Rail Weld TRK-081 & TDMS Power Block TRC-031)'}
                  </Tag>
                </Col>
              </Row>
            </Card>

            {/* Action Footer inside Drawer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              <Button onClick={() => setDetailDrawerOpen(false)}>Close</Button>
              <Button
                type="primary"
                icon={<SendOutlined />}
                style={{ background: '#059669', borderColor: '#059669' }}
                onClick={() => {
                  setDetailDrawerOpen(false);
                  setSelectedItem(selectedDetailRecord);
                  setSendBlockModalOpen(true);
                }}
              >
                SUBMIT DISCONNECTION BLOCK REQUEST
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Contextual Workflows */}
      <AddDefectModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
      <SendBlockRequestModal open={sendBlockModalOpen} onClose={() => setSendBlockModalOpen(false)} targetItem={selectedItem} />
    </div>
  );
};

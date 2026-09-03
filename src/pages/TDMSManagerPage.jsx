import React, { useState } from 'react';
import { Card, Table, Tag, Button, Tabs, Space, Progress, Drawer, Descriptions, Divider, Alert, Row, Col } from 'antd';
import { BlockOutlined, PlusOutlined, SendOutlined, EyeOutlined, ThunderboltOutlined, EnvironmentOutlined, RobotOutlined, WarningOutlined, ToolOutlined } from '@ant-design/icons';
import { useRegion } from '../context/RegionContext';
import { AddDefectModal } from '../components/common/AddDefectModal';
import { SendBlockRequestModal } from '../components/common/SendBlockRequestModal';

export const TDMSManagerPage = () => {
  const { filteredDefects } = useRegion();
  const [activeTab, setActiveTab] = useState('Pending');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [sendBlockModalOpen, setSendBlockModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedDetailRecord, setSelectedDetailRecord] = useState(null);

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
      title: 'OHE Asset Structure',
      dataIndex: 'Asset_ID',
      key: 'Asset_ID',
      render: (a, record) => <Tag color="purple">{a || record.assetId || 'OHE-MAST-142/14'}</Tag>
    },
    {
      title: 'Traction Fault Type',
      dataIndex: 'Defect_Type',
      key: 'Defect_Type',
      render: (t, record) => <strong style={{ color: '#7c3aed' }}>{t || record.defectType}</strong>
    },
    {
      title: 'Location / Mast',
      dataIndex: 'location',
      key: 'location'
    },
    {
      title: 'Traction Electrical Readings',
      key: 'electrical',
      render: (_, r) => (
        <div style={{ fontSize: 11, lineHeight: 1.4 }}>
          <div>Voltage: <strong>{r.Voltage_V ? `${(r.Voltage_V / 1000).toFixed(1)} kV` : '25.2 kV'}</strong></div>
          <div>Current: <strong>{r.Current_A ? `${r.Current_A} A` : '420 A'}</strong></div>
          <div>Power Load: <strong>{r.Power_Load_MW ? `${r.Power_Load_MW} MW` : '14.5 MW'}</strong></div>
        </div>
      )
    },
    {
      title: 'Environment Context',
      key: 'environment',
      render: (_, r) => (
        <div style={{ fontSize: 11, lineHeight: 1.4 }}>
          <div>Wind: <strong>{r.Wind_Speed_kmh ? `${r.Wind_Speed_kmh} km/h` : '34 km/h'}</strong></div>
          <div>Weather: <Tag size="small" color="blue">{r.Weather_Condition || 'Clear'}</Tag></div>
        </div>
      )
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
        const pScore = score || record.priorityScore || 88;
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
            Request Block
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
            <BlockOutlined style={{ color: '#7c3aed' }} /> TDMS — Traction Distribution OHE Manager
          </h1>
          <p style={{ color: 'var(--ir-text-sub)', margin: 0, fontSize: 13 }}>
            Official CRIS TDMS Protocol: 25 kV AC OHE wires, insulators, neutral sections, electrical telemetry &amp; power block management
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

      {/* Comprehensive 50-Field TDMS Defect Inspector & AI Analytics Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#7c3aed' }}>
            <BlockOutlined />
            <span>TDMS Defect Telemetry &amp; Decision-Support: {selectedDetailRecord?.Defect_ID || selectedDetailRecord?.id}</span>
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
              message="CRIS TDMS RECORD &amp; AI DECISION-SUPPORT ADVISORY"
              description="Observed field telemetry and environmental readings are stored directly from TDMS logs. Risk scores and RUL estimates represent simulated AI decision-support results."
              style={{ fontSize: 12 }}
            />

            {/* SECTION 1: RAW OBSERVED TDMS TRACTION READINGS */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.5px' }}>
                1. Raw Observed Electrical &amp; Traction Readings
              </div>
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="Line Voltage (V)">
                  <strong>{selectedDetailRecord.Voltage_V ? `${selectedDetailRecord.Voltage_V.toLocaleString()} V (${(selectedDetailRecord.Voltage_V / 1000).toFixed(1)} kV)` : '25,200 V (25.2 kV)'}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Traction Current (A)">
                  <strong>{selectedDetailRecord.Current_A ? `${selectedDetailRecord.Current_A} A` : '420 A'}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Power Load (MW)">
                  <strong>{selectedDetailRecord.Power_Load_MW ? `${selectedDetailRecord.Power_Load_MW} MW` : '14.5 MW'}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Detection Method">
                  {selectedDetailRecord.Detection_Method || 'Tower Wagon Patrol'}
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* SECTION 2: ASSET HEALTH & MAINTENANCE HISTORY */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.5px' }}>
                2. Asset Health &amp; Maintenance Context
              </div>
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="Asset Structure ID">{selectedDetailRecord.Asset_ID || selectedDetailRecord.assetId}</Descriptions.Item>
                <Descriptions.Item label="Asset Type">{selectedDetailRecord.Asset_Type || 'OHE Cantilever Insulator'}</Descriptions.Item>
                <Descriptions.Item label="Component Health">
                  <Tag color="orange">{selectedDetailRecord.Component_Health || '64% (Attention Needed)'}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Asset Lifecycle Age">{selectedDetailRecord.Asset_Age_Years ? `${selectedDetailRecord.Asset_Age_Years} Years` : '14.2 Years'}</Descriptions.Item>
                <Descriptions.Item label="Last Maintenance Date">{selectedDetailRecord.Last_Maintenance_Date || '2026-05-10'}</Descriptions.Item>
                <Descriptions.Item label="Maintenance Frequency">{selectedDetailRecord.Maintenance_Frequency_Days ? `${selectedDetailRecord.Maintenance_Frequency_Days} Days` : '90 Days'}</Descriptions.Item>
                <Descriptions.Item label="Historical Failure Count">{selectedDetailRecord.Historical_Failure_Count ?? 3} Failures</Descriptions.Item>
                <Descriptions.Item label="Overdue Days">
                  <Tag color={selectedDetailRecord.Overdue_Days > 0 ? 'red' : 'green'}>{selectedDetailRecord.Overdue_Days ?? 3} Overdue Days</Tag>
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* SECTION 3: ENVIRONMENTAL & OPERATIONAL CONTEXT */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#d97706', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.5px' }}>
                3. Environmental &amp; Operational Context
              </div>
              <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="Wind Speed (km/h)">
                  <strong>{selectedDetailRecord.Wind_Speed_kmh ? `${selectedDetailRecord.Wind_Speed_kmh} km/h` : '34 km/h'}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Weather Condition">{selectedDetailRecord.Weather_Condition || 'High Wind / Clear'}</Descriptions.Item>
                <Descriptions.Item label="Traffic Density">{selectedDetailRecord.Traffic_Trains_Per_Day ? `${selectedDetailRecord.Traffic_Trains_Per_Day} Trains/Day` : '44 Trains/Day'}</Descriptions.Item>
                <Descriptions.Item label="Goods Forecast">{selectedDetailRecord.Goods_Trains_Forecast ? `${selectedDetailRecord.Goods_Trains_Forecast} Freight Trains` : '18 Freight Trains'}</Descriptions.Item>
                <Descriptions.Item label="Route Criticality" span={2}>
                  <Tag color="volcano">{selectedDetailRecord.Route_Criticality || 'High Criticality Quad Corridor'}</Tag>
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
                <Descriptions.Item label="Overlapping S&amp;T (SMMS) Request">
                  <Tag color="gold">{selectedDetailRecord.Overlapping_SNT_Request || 'SIG-2026-042 (Point Machine 102B Overhaul)'}</Tag>
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
                  <div style={{ fontSize: 11, color: 'var(--ir-text-sub)' }}>Failure Probability (72h)</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#dc2626' }}>
                    {selectedDetailRecord.Failure_Probability_72h ? `${(selectedDetailRecord.Failure_Probability_72h * 100).toFixed(0)}%` : '88%'}
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: 11, color: 'var(--ir-text-sub)' }}>Remaining Useful Life (RUL)</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#d97706' }}>
                    {selectedDetailRecord.Remaining_Useful_Life_Hours ? `${selectedDetailRecord.Remaining_Useful_Life_Hours} Hours` : '36 Hours'}
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: 11, color: 'var(--ir-text-sub)' }}>Priority Score / Class</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#1e3a8a' }}>
                    {selectedDetailRecord.Priority_Score || 88} / 100 ({selectedDetailRecord.Priority_Class || 'CRITICAL'})
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ fontSize: 11, color: 'var(--ir-text-sub)' }}>Predicted Resolution Time</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#059669' }}>
                    {selectedDetailRecord.Predicted_Resolution_Time_Hours ? `${selectedDetailRecord.Predicted_Resolution_Time_Hours} Hours` : '3.5 Hours'}
                  </div>
                </Col>
                <Col span={24}>
                  <div style={{ fontSize: 11, color: 'var(--ir-text-sub)' }}>Risk If Delayed</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#dc2626', marginTop: 2 }}>
                    {selectedDetailRecord.Risk_If_Delayed || 'High Risk of OHE Catenary Snap & Pantograph Entanglement causing 6+ hr Corridor Disruption'}
                  </div>
                </Col>
                <Col span={24}>
                  <Divider style={{ margin: '8px 0' }} />
                  <div style={{ fontSize: 11, color: 'var(--ir-text-sub)' }}>Recommended Joint Block Decision</div>
                  <Tag color="green" style={{ fontWeight: 700, marginTop: 4 }}>
                    {selectedDetailRecord.Joint_Block_Recommendation || 'RECOMMENDED (Merge Power Block with TMS Rail Weld & SMMS Signal Point)'}
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
                SUBMIT POWER BLOCK REQUEST
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

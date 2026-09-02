import React, { useState } from 'react';
import { Card, Table, Tag, Button, Input, Select, Space, Modal, Form, Row, Col, DatePicker, Descriptions, Drawer, Progress, Alert, message, Tooltip, Divider } from 'antd';
import {
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  RobotOutlined,
  AimOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ToolOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { TMS_DEFECTS, TMS_ASSET_DEFECT_MAP, DIVISIONS } from '../mock/apiData';
import { useRegion } from '../context/RegionContext';
import { exportReportToExcel } from '../utils/excelExport';

export const TMSManagerPage = ({ userRole }) => {
  const { filterByRegion, selectedZone, selectedDivision } = useRegion();
  const [data, setData] = useState(TMS_DEFECTS);
  const [searchText, setSearchText] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');

  // Modal & Drawer states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedInspectDefect, setSelectedInspectDefect] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [form] = Form.useForm();
  const formAssetType = Form.useWatch('Asset_Type', form);

  const isReadOnly = userRole === 'Viewer';

  // Apply RegionContext filter + local search & asset filter
  const regionFilteredData = filterByRegion(data);
  const finalFilteredData = regionFilteredData.filter(item => {
    const matchesSearch = !searchText || Object.values(item).some(val => val && String(val).toLowerCase().includes(searchText.toLowerCase()));
    const matchesAsset = selectedAsset === 'ALL' || item.Asset_Type === selectedAsset;
    const matchesSeverity = selectedSeverity === 'ALL' || item.Severity_Level === selectedSeverity;
    return matchesSearch && matchesAsset && matchesSeverity;
  });

  // Calculate Automated AI Output Fields on Defect Logging
  const calculateSystemOutputs = (manualInputs) => {
    const reportedDate = manualInputs.Reported_Date ? dayjs(manualInputs.Reported_Date) : dayjs();
    const severity = manualInputs.Severity_Level;

    // SLA Days
    const slaDays = severity === 'Critical' ? 1 : severity === 'High' ? 3 : severity === 'Medium' ? 7 : 14;
    const dueDate = reportedDate.add(slaDays, 'day');
    const overdueDays = dayjs().isAfter(dueDate) ? dayjs().diff(dueDate, 'day') : 0;

    // Priority Score Math
    const baseScore = severity === 'Critical' ? 95 : severity === 'High' ? 82 : severity === 'Medium' ? 65 : 45;
    const priorityScore = Math.min(100, baseScore + (overdueDays * 4));

    // Urgency Tier & Planning Horizon
    const urgencyTier = severity === 'Critical' ? 'Tier 1 (Immediate - 24 Hours)' : severity === 'High' ? 'Tier 2 (High - 72 Hours)' : 'Tier 3 (Medium - Weekly Window)';
    const horizon = severity === 'Critical' ? 'Immediate 24 Hours' : severity === 'High' ? 'Weekly Window' : 'Monthly Schedule';

    // Joint Block Feasibility
    const feasibilityScore = (85 + Math.floor(Math.random() * 12)).toFixed(1);

    // Block Duration & Resolution Hours
    const durationHrs = manualInputs.Asset_Type === 'Rail' ? 4.0 : manualInputs.Asset_Type === 'Point & Crossing' ? 4.0 : 3.0;
    const resolutionHrs = (durationHrs - 0.5).toFixed(1);

    // Risks & Recommendations
    const risk = severity === 'Critical' 
      ? 'High Risk of Track Fracture, Rail Derailment, or Emergency Speed Restriction' 
      : severity === 'High' 
        ? 'Progressive Track Geometry Degradation & Speed Reduction to 30 km/h'
        : 'Accelerated Component Wear & Increased Life-Cycle Maintenance Cost';

    const recommendation = `Merge ${manualInputs.Asset_Type} maintenance on ${manualInputs.Section_ID || 'corridor'} with SMMS Signal Calibration & TDMS OHE Power Possession window.`;

    return {
      Defect_ID: `TRK-2026-${Math.floor(100 + Math.random() * 900)}`,
      Due_Date: dueDate.format('YYYY-MM-DD'),
      Overdue_Days: overdueDays,
      Joint_Block_Feasibility_Score: Number(feasibilityScore),
      Task_Urgency_Tier: urgencyTier,
      Planning_Horizon: horizon,
      Recommended_Block_Date: reportedDate.add(2, 'day').format('YYYY-MM-DD'),
      Recommended_Block_Duration_Hours: durationHrs,
      Joint_Block_Recommendation: recommendation,
      Priority_Score: priorityScore,
      Predicted_Resolution_Time_Hours: Number(resolutionHrs),
      Risk_If_Delayed: risk,
      Confidence_Score: `${(94 + Math.random() * 5).toFixed(1)}%`
    };
  };

  const handleSaveDefect = (values) => {
    const formattedDate = values.Reported_Date ? dayjs(values.Reported_Date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
    const manualInputs = { ...values, Reported_Date: formattedDate };
    
    // System calculates all 13 AI Output fields automatically
    const calculatedOutputs = calculateSystemOutputs(manualInputs);

    const fullDefectRecord = {
      ...manualInputs,
      ...calculatedOutputs,
      id: calculatedOutputs.Defect_ID,
      department: 'TMS',
      deptLabel: 'Engineering (Track)',
      location: `${values.Section_ID} (KM ${values.Chainage_KM})`,
      section: values.Section_ID,
      zone: selectedZone === 'ALL' ? 'NR' : selectedZone,
      division: selectedDivision === 'ALL' ? 'DLI' : selectedDivision,
      status: 'Pending Block'
    };

    setData([fullDefectRecord, ...data]);
    message.success(`Logged Track Defect ${fullDefectRecord.Defect_ID}. System computed 13 AI Outputs automatically!`);
    setIsAddModalOpen(false);
    form.resetFields();

    // Auto-open Inspector Drawer for newly created record
    setSelectedInspectDefect(fullDefectRecord);
    setIsDrawerOpen(true);
  };

  const handleOpenInspect = (record) => {
    setSelectedInspectDefect(record);
    setIsDrawerOpen(true);
  };

  const handleExportExcel = () => {
    const headers = [
      'Defect ID', 'Section ID', 'Station 1', 'Station 2', 'Chainage KM', 'Latitude', 'Longitude', 'Asset Type', 'Defect Type', 'Severity', 'Detection Method', 'Reported Date',
      'Due Date', 'Overdue Days', 'Joint Block Feasibility Score', 'Urgency Tier', 'Planning Horizon', 'Recommended Block Date', 'Recommended Duration (Hrs)', 'Joint Recommendation', 'Priority Score', 'Predicted Resolution Hrs', 'Risk If Delayed', 'Confidence Score'
    ];
    const rows = finalFilteredData.map(d => [
      d.Defect_ID || d.id, d.Section_ID || d.section, d.Station1 || 'NDLS', d.Station2 || 'CNB', d.Chainage_KM || '142.0', d.Latitude || '28.6139 N', d.Longitude || '77.2090 E', d.Asset_Type || 'Rail', d.Defect_Type || d.defectType, d.Severity_Level || d.severity, d.Detection_Method || 'UFD', d.Reported_Date || d.dateReported,
      d.Due_Date, d.Overdue_Days, `${d.Joint_Block_Feasibility_Score}%`, d.Task_Urgency_Tier, d.Planning_Horizon, d.Recommended_Block_Date, d.Recommended_Block_Duration_Hours, d.Joint_Block_Recommendation, d.Priority_Score, d.Predicted_Resolution_Time_Hours, d.Risk_If_Delayed, d.Confidence_Score
    ]);
    exportReportToExcel('TMS_Track_Maintenance_Full_Schema', 'TMS_Defects', headers, rows);
  };

  const columns = [
    { title: 'Defect ID', dataIndex: 'id', key: 'id', render: id => <strong style={{ fontFamily: 'monospace' }}>{id}</strong> },
    { title: 'Section / Stretch', dataIndex: 'Section_ID', key: 'Section_ID', render: sec => <span style={{ fontWeight: 600 }}>{sec || 'NDLS - CNB'}</span> },
    { title: 'Chainage (KM)', dataIndex: 'Chainage_KM', key: 'Chainage_KM', render: km => <Tag color="geekblue">KM {km || '142.0'}</Tag> },
    { title: 'Asset Type', dataIndex: 'Asset_Type', key: 'Asset_Type', render: asset => <Tag color="blue">{asset || 'Rail'}</Tag> },
    { title: 'Observed Defect Type', dataIndex: 'Defect_Type', key: 'Defect_Type', render: d => d || 'Rail Flaw USFD' },
    {
      title: 'Severity',
      dataIndex: 'Severity_Level',
      key: 'Severity_Level',
      render: sev => (
        <Tag color={sev === 'Critical' ? 'error' : sev === 'High' ? 'warning' : 'processing'} style={{ fontWeight: 700 }}>
          {sev || 'High'}
        </Tag>
      )
    },
    { title: 'Detection Method', dataIndex: 'Detection_Method', key: 'Detection_Method', render: m => <Tag color="purple">{m || 'UFD'}</Tag> },
    {
      title: 'AI Feasibility Score',
      dataIndex: 'Joint_Block_Feasibility_Score',
      key: 'Joint_Block_Feasibility_Score',
      render: score => <strong>{score || 94.5}%</strong>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" type="primary" icon={<RobotOutlined />} onClick={() => handleOpenInspect(record)}>
            Inspect AI Outputs (13)
          </Button>
        </Space>
      )
    }
  ];

  const availableDefectsForAsset = formAssetType ? (TMS_ASSET_DEFECT_MAP[formAssetType] || []) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <ToolOutlined style={{ color: '#1e3a8a' }} /> TMS Engineering (Track) Defect & Maintenance Protocol Manager
          </h1>
          <p style={{ color: 'var(--ir-text-sub)', margin: 0, fontSize: 13 }}>
            Track defect logging, automated SLA calculation, and joint block feasibility analysis
          </p>
        </div>

        <Space size="middle">
          <Button type="primary" icon={<PlusOutlined />} disabled={isReadOnly} onClick={() => setIsAddModalOpen(true)}>
            Log Track Defect (Manual Input)
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExportExcel}>
            Export Full Schema Excel
          </Button>
        </Space>
      </div>

      {/* Filter Bar */}
      <Card bodyStyle={{ padding: 16 }} style={{ borderRadius: 10, border: '1px solid var(--ir-border)' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} lg={6}>
            <Input
              placeholder="Search TMS defects..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={6} lg={5}>
            <Select
              value={selectedAsset}
              onChange={setSelectedAsset}
              style={{ width: '100%' }}
              options={[
                { value: 'ALL', label: 'All Asset Types' },
                { value: 'Rail', label: 'Rail' },
                { value: 'Sleeper', label: 'Sleeper' },
                { value: 'Ballast', label: 'Ballast' },
                { value: 'Point & Crossing', label: 'Point & Crossing' },
                { value: 'Level Crossing', label: 'Level Crossing' },
                { value: 'Bridge', label: 'Bridge' },
              ]}
            />
          </Col>
          <Col xs={12} sm={6} lg={5}>
            <Select
              value={selectedSeverity}
              onChange={setSelectedSeverity}
              style={{ width: '100%' }}
              options={[
                { value: 'ALL', label: 'All Severities' },
                { value: 'Critical', label: 'Critical' },
                { value: 'High', label: 'High' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Low', label: 'Low' },
              ]}
            />
          </Col>
          <Col xs={24} lg={8} style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 13, color: 'var(--ir-text-sub)' }}>
              Showing <strong>{finalFilteredData.length}</strong> defect records
            </span>
          </Col>
        </Row>
      </Card>

      {/* Main Table */}
      <Card bodyStyle={{ padding: 16 }} style={{ borderRadius: 10, border: '1px solid var(--ir-border)' }}>
        <Table
          columns={columns}
          dataSource={finalFilteredData}
          rowKey="id"
          pagination={{ pageSize: 7 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* Add Defect Modal (Strict Manual Input Fields Only) */}
      <Modal
        title="Inputs You Manually Enter When a Defect Is Found (TMS Protocol)"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        onOk={() => form.submit()}
        width={700}
        destroyOnClose
      >
        <Alert
          message="Manual Data Ingestion"
          description="System will automatically compute the 13 Output Fields (Due Date, Joint Block Feasibility, Priority Score, Urgency Tier, Risk If Delayed, Confidence Score, etc.) upon submission."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Form form={form} layout="vertical" onFinish={handleSaveDefect} initialValues={{ Severity_Level: 'High', Detection_Method: 'UFD', Asset_Type: 'Rail', Reported_Date: dayjs() }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="Section_ID" label="Section ID / Stretch" rules={[{ required: true, message: 'Specify Section ID' }]}>
                <Input placeholder="e.g. SEC-NDLS-CNB-DN" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="Station1" label="Station 1" rules={[{ required: true }]}>
                <Input placeholder="e.g. New Delhi (NDLS)" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="Station2" label="Station 2" rules={[{ required: true }]}>
                <Input placeholder="e.g. Kanpur Central (CNB)" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="Chainage_KM" label="Chainage KM (Exact Marker)" rules={[{ required: true }]}>
                <Input placeholder="e.g. 142.450" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="Latitude" label="Latitude (GPS)">
                <Input placeholder="e.g. 28.6139 N" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="Longitude" label="Longitude (GPS)">
                <Input placeholder="e.g. 77.2090 E" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="Asset_Type" label="Asset Type" rules={[{ required: true }]}>
                <Select options={[
                  { value: 'Rail', label: 'Rail' },
                  { value: 'Sleeper', label: 'Sleeper' },
                  { value: 'Ballast', label: 'Ballast' },
                  { value: 'Point & Crossing', label: 'Point & Crossing' },
                  { value: 'Level Crossing', label: 'Level Crossing' },
                  { value: 'Bridge', label: 'Bridge' }
                ]} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="Defect_Type" label="Defect Type (Filtered by Asset)" rules={[{ required: true }]}>
                <Select
                  placeholder="Select defect observed"
                  options={availableDefectsForAsset.map(d => ({ label: d, value: d }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="Severity_Level" label="Severity Level" rules={[{ required: true }]}>
                <Select options={[
                  { value: 'Critical', label: 'Critical' },
                  { value: 'High', label: 'High' },
                  { value: 'Medium', label: 'Medium' },
                  { value: 'Low', label: 'Low' }
                ]} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="Detection_Method" label="Detection Method" rules={[{ required: true }]}>
                <Select options={[
                  { value: 'TRC Survey', label: 'TRC Survey' },
                  { value: 'Manual Patrol', label: 'Manual Patrol' },
                  { value: 'UFD', label: 'UFD' }
                ]} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="Reported_Date" label="Reported Date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* System Calculated Outputs Inspector Drawer (13 Output Fields) */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RobotOutlined style={{ color: '#0284c7' }} />
            <span>Automated System AI Outputs: {selectedInspectDefect?.Defect_ID || selectedInspectDefect?.id}</span>
          </div>
        }
        placement="right"
        width={540}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
      >
        {selectedInspectDefect && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Alert
              type="success"
              showIcon
              message="System AI Engine Computed Output Metrics"
              description="Outputs generated automatically based on reported defect severity, asset location, corridor density, and SLA parameters."
            />

            <Descriptions title="13 System Calculated Outputs (Never Manually Entered)" column={1} bordered size="small">
              <Descriptions.Item label="1. Defect_ID">
                <strong style={{ fontFamily: 'monospace', color: '#1e3a8a' }}>{selectedInspectDefect.Defect_ID || selectedInspectDefect.id}</strong>
              </Descriptions.Item>

              <Descriptions.Item label="2. Due_Date">
                <Tag color="volcano">{selectedInspectDefect.Due_Date || '2026-08-31'}</Tag>
              </Descriptions.Item>

              <Descriptions.Item label="3. Overdue_Days">
                <strong>{selectedInspectDefect.Overdue_Days || 0} Days</strong>
              </Descriptions.Item>

              <Descriptions.Item label="4. Joint_Block_Feasibility_Score">
                <Progress percent={selectedInspectDefect.Joint_Block_Feasibility_Score || 94.5} size="small" strokeColor="#059669" />
              </Descriptions.Item>

              <Descriptions.Item label="5. Task_Urgency_Tier">
                <Tag color="red">{selectedInspectDefect.Task_Urgency_Tier || 'Tier 1 (Immediate - 24 Hours)'}</Tag>
              </Descriptions.Item>

              <Descriptions.Item label="6. Planning_Horizon">
                <Tag color="geekblue">{selectedInspectDefect.Planning_Horizon || 'Next 24 Hours'}</Tag>
              </Descriptions.Item>

              <Descriptions.Item label="7. Recommended_Block_Date">
                <strong>{selectedInspectDefect.Recommended_Block_Date || '2026-09-03'}</strong>
              </Descriptions.Item>

              <Descriptions.Item label="8. Recommended_Block_Duration_Hours">
                <Tag color="purple">{selectedInspectDefect.Recommended_Block_Duration_Hours || 4.0} Hours</Tag>
              </Descriptions.Item>

              <Descriptions.Item label="9. Joint_Block_Recommendation">
                <span style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>
                  {selectedInspectDefect.Joint_Block_Recommendation || 'Merge with SMMS Point Machine Overhaul & TDMS Insulator Replace'}
                </span>
              </Descriptions.Item>

              <Descriptions.Item label="10. Priority_Score">
                <Tag color="error" style={{ fontWeight: 800 }}>{selectedInspectDefect.Priority_Score || 95} / 100</Tag>
              </Descriptions.Item>

              <Descriptions.Item label="11. Predicted_Resolution_Time_Hours">
                <strong>{selectedInspectDefect.Predicted_Resolution_Time_Hours || 3.5} Work Hours</strong>
              </Descriptions.Item>

              <Descriptions.Item label="12. Risk_If_Delayed">
                <Alert
                  type="warning"
                  showIcon
                  message={selectedInspectDefect.Risk_If_Delayed || 'High Risk of Derailment / Track Fracture on High-Speed Corridor'}
                  style={{ fontSize: 11, padding: 8 }}
                />
              </Descriptions.Item>

              <Descriptions.Item label="13. Confidence_Score">
                <Tag color="cyan" style={{ fontWeight: 700 }}>{selectedInspectDefect.Confidence_Score || '98.2%'}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>
    </div>
  );
};

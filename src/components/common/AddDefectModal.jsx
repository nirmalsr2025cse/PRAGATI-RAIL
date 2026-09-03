import React, { useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Upload, Button, Tag, Alert, message, Row, Col, Divider, InputNumber } from 'antd';
import { PlusOutlined, UploadOutlined, ToolOutlined, ThunderboltOutlined, BlockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

export const AddDefectModal = ({ open, onClose, defaultAsset = null, onDefectAdded }) => {
  const { currentUser } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const dept = currentUser?.department || 'SMMS';

  const defectCategories = {
    TMS: [
      { label: 'Rail Head Wear / Shelling', value: 'Rail Head Wear' },
      { label: 'Sleeper Cracks / Fastening Loose', value: 'Sleeper Cracks' },
      { label: 'Ballast Cushion Deficiency', value: 'Ballast Deficiency' },
      { label: 'Point & Crossing Track Joint', value: 'Point Track Joint' },
      { label: 'Level Crossing Gate Rail Wear', value: 'Level Crossing Rail' },
      { label: 'Bridge Expansion Joint Defect', value: 'Bridge Expansion Defect' }
    ],
    SMMS: [
      { label: 'Point Machine 102B Overhaul Fault', value: 'Point Machine 102B Overhaul Fault' },
      { label: 'Track Circuit Glitch / Failure', value: 'Track Circuit Glitch / Failure' },
      { label: 'Signal LED Aspect Blanking', value: 'Signal LED Aspect Blanking' },
      { label: 'Axle Counter Sensor Drift', value: 'Axle Counter Sensor Drift' },
      { label: 'Relay Interlocking Contact Corrosion', value: 'Relay Interlocking Contact Corrosion' }
    ],
    TDMS: [
      { label: 'OHE Cantilever Insulator Breakdown', value: 'OHE Cantilever Insulator Breakdown' },
      { label: 'OHE Catenary Wire Dropper Slackness', value: 'OHE Catenary Wire Dropper Slackness' },
      { label: 'Neutral Section Flashover Defect', value: 'Neutral Section Flashover Defect' },
      { label: 'Pantograph Contact Wire Abrasion', value: 'Pantograph Contact Wire Abrasion' },
      { label: 'Substation Transformer Overheating', value: 'Substation Transformer Overheating' }
    ]
  };

  const handleFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const prefix = dept === 'TDMS' ? 'TRC' : dept === 'SMMS' ? 'SIG' : 'TRK';
      const newDefectId = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newDefect = {
        id: newDefectId,
        Defect_ID: newDefectId,
        department: dept,
        section: values.sectionId || 'LKO–CNB',
        location: `${values.station1 || 'LKO'} – ${values.station2 || 'CNB'} (KM ${values.chainage || '142.1'})`,
        Asset_ID: values.assetId || defaultAsset?.id || (dept === 'SMMS' ? 'SIG-PT-102B' : `AST-${dept}-01`),
        Asset_Type: values.assetType || (dept === 'SMMS' ? 'Point Machine' : dept === 'TDMS' ? 'OHE Cantilever Insulator' : 'Rail'),
        Defect_Type: values.defectCategory,
        Severity_Level: values.severity,
        Detection_Method: values.detectionMethod || (dept === 'SMMS' ? 'Remote Diagnostic System (SSI Log)' : 'Field Inspection'),
        Reported_Date: new Date().toISOString().split('T')[0],
        status: 'Pending Block',
        reportedBy: currentUser?.name || 'Engineer',

        // SMMS Signalling Specific Fields (NO Traction Voltage/Current/Load)
        Power_Supply_Type: values.powerSupplyType || (dept === 'SMMS' ? '110V AC Signalling Power' : undefined),
        Interlocking_Type: values.interlockingType || (dept === 'SMMS' ? 'Electronic Interlocking (EI)' : undefined),
        Communication_Link_Status: values.commLinkStatus || (dept === 'SMMS' ? 'Degraded' : undefined),

        // TDMS Traction Electrical Readings (TDMS Only)
        Voltage_V: dept === 'TDMS' ? (values.voltageV || 25200) : undefined,
        Current_A: dept === 'TDMS' ? (values.currentA || 420) : undefined,
        Power_Load_MW: dept === 'TDMS' ? (values.powerLoadMW || 14.5) : undefined,

        // Asset Health & Environment
        Component_Health: `${values.componentHealth || 70}%`,
        Asset_Age_Years: values.assetAgeYears || 6.5,
        Last_Maintenance_Date: values.lastMaintenanceDate ? values.lastMaintenanceDate.format('YYYY-MM-DD') : '2026-05-15',
        Maintenance_Frequency_Days: values.maintFreqDays || 60,
        Historical_Failure_Count: values.histFailures || 2,
        Wind_Speed_kmh: values.windSpeedKmh || 25,
        Weather_Condition: values.weatherCondition || 'Clear',

        // Maintenance & SLA (No forced AI output fields)
        Work_Due_Date: values.workDueDate ? values.workDueDate.format('YYYY-MM-DD') : '2026-09-04',
        Overdue_Days: 0,
        Work_Overall_Duration: values.workDurationHrs || 3.0,
        Priority_Score: 82
      };

      message.success(`Logged New ${dept} Defect: ${newDefectId}`);
      if (onDefectAdded) onDefectAdded(newDefect);
      form.resetFields();
      onClose();
    }, 500);
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ir-text-main)' }}>
          {dept === 'TMS' ? <ToolOutlined style={{ color: '#0284c7' }} /> : dept === 'SMMS' ? <ThunderboltOutlined style={{ color: '#d97706' }} /> : <BlockOutlined style={{ color: '#7c3aed' }} />}
          <span>LOG NEW MAINTENANCE DEFECT ({dept} DEPARTMENT PROTOCOL)</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
    >
      <Alert
        type="info"
        showIcon
        message={`MANUAL FIELD LOGGING AS: ${currentUser?.name || 'Engineer'} (${currentUser?.designation})`}
        description={`Enter observed ${dept} asset, defect, system diagnostics, and maintenance data. Decision-support AI scores and block recommendations will be calculated post-submission.`}
        style={{ marginBottom: 16, fontSize: 11 }}
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          sectionId: 'SEC-NDLS-CNB-DN',
          station1: 'Lucknow JN (LKO)',
          station2: 'Kanpur Central (CNB)',
          chainage: '142.100',
          zone: 'NR',
          division: 'DLI',
          severity: 'High',
          detectionMethod: dept === 'SMMS' ? 'Remote Diagnostic System (SSI Log)' : 'Field Patrol Inspection',
          assetId: defaultAsset?.id || (dept === 'SMMS' ? 'SIG-PT-102B' : `AST-${dept}-01`),
          assetType: dept === 'SMMS' ? 'Point Machine' : dept === 'TDMS' ? 'OHE Cantilever Insulator' : 'Rail',
          powerSupplyType: '110V AC Signalling Power',
          interlockingType: 'Electronic Interlocking (EI)',
          commLinkStatus: 'Degraded',
          voltageV: 25200,
          currentA: 420,
          powerLoadMW: 14.5,
          componentHealth: 70,
          assetAgeYears: 6.5,
          maintFreqDays: 60,
          histFailures: 2,
          workDurationHrs: 3.0
        }}
      >
        {/* 1. ASSET & LOCATION INFORMATION */}
        <div style={{ fontSize: 12, fontWeight: 800, color: '#1e3a8a', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.5px' }}>
          1. Asset &amp; Location Information
        </div>
        <Row gutter={12}>
          <Col span={8}>
            <Form.Item label="Asset ID" name="assetId" rules={[{ required: true }]}>
              <Input placeholder="e.g. SIG-PT-102B" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Asset Type" name="assetType" rules={[{ required: true }]}>
              <Input placeholder="e.g. Point Machine / Track Circuit" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Section ID" name="sectionId" rules={[{ required: true }]}>
              <Input placeholder="e.g. SEC-NDLS-CNB-DN" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Station 1" name="station1" rules={[{ required: true }]}>
              <Input placeholder="Lucknow JN (LKO)" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Station 2" name="station2" rules={[{ required: true }]}>
              <Input placeholder="Kanpur Central (CNB)" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Chainage (KM)" name="chainage" rules={[{ required: true }]}>
              <Input placeholder="142.100" />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ margin: '8px 0 12px 0' }} />

        {/* 2. DEFECT INFORMATION */}
        <div style={{ fontSize: 12, fontWeight: 800, color: '#d97706', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.5px' }}>
          2. Defect Information
        </div>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item label={`${dept} Specific Defect Category`} name="defectCategory" rules={[{ required: true }]}>
              <Select options={defectCategories[dept] || defectCategories.SMMS} placeholder="Select defect type" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Severity Level" name="severity" rules={[{ required: true }]}>
              <Select options={[
                { label: 'Critical (S1)', value: 'Critical' },
                { label: 'High (S2)', value: 'High' },
                { label: 'Medium (S3)', value: 'Medium' },
                { label: 'Low (S4)', value: 'Low' }
              ]} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Detection Method" name="detectionMethod" rules={[{ required: true }]}>
              <Input placeholder="Remote SSI Diagnostic Log" />
            </Form.Item>
          </Col>
        </Row>

        {/* 3. SIGNALLING SYSTEM SPECIFIC DATA (FOR SMMS ONLY) */}
        {dept === 'SMMS' && (
          <>
            <Divider style={{ margin: '8px 0 12px 0' }} />
            <div style={{ fontSize: 12, fontWeight: 800, color: '#d97706', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.5px' }}>
              3. Signalling System &amp; Interlocking Data (SMMS Specific)
            </div>
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item label="Power Supply Type" name="powerSupplyType" rules={[{ required: true }]}>
                  <Select options={[
                    { label: '110V AC Signalling Power', value: '110V AC Signalling Power' },
                    { label: '24V DC Relay Supply', value: '24V DC Relay Supply' },
                    { label: 'IPS Integrated Power Supply', value: 'IPS Integrated Power Supply' }
                  ]} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Interlocking Type" name="interlockingType" rules={[{ required: true }]}>
                  <Select options={[
                    { label: 'Electronic Interlocking (EI)', value: 'Electronic Interlocking (EI)' },
                    { label: 'Route Relay Interlocking (RRI)', value: 'Route Relay Interlocking (RRI)' },
                    { label: 'Panel Interlocking (PI)', value: 'Panel Interlocking (PI)' }
                  ]} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Comm Link Status" name="commLinkStatus" rules={[{ required: true }]}>
                  <Select options={[
                    { label: 'Healthy', value: 'Healthy' },
                    { label: 'Degraded', value: 'Degraded' },
                    { label: 'Down', value: 'Down' }
                  ]} />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        {/* TDMS TRACTION ELECTRICAL READINGS (FOR TDMS ONLY) */}
        {dept === 'TDMS' && (
          <>
            <Divider style={{ margin: '8px 0 12px 0' }} />
            <div style={{ fontSize: 12, fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.5px' }}>
              3. Electrical / Traction Telemetry (TDMS Specific)
            </div>
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item label="Voltage (Volts)" name="voltageV" rules={[{ required: true }]}>
                  <InputNumber style={{ width: '100%' }} placeholder="25200 V (25.2 kV)" addonAfter="V" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Current (Amperes)" name="currentA" rules={[{ required: true }]}>
                  <InputNumber style={{ width: '100%' }} placeholder="420 A" addonAfter="A" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Power Load (MW)" name="powerLoadMW" rules={[{ required: true }]}>
                  <InputNumber style={{ width: '100%' }} placeholder="14.5 MW" addonAfter="MW" />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        <Divider style={{ margin: '8px 0 12px 0' }} />

        {/* 4. ASSET HEALTH & MAINTENANCE CONTEXT */}
        <div style={{ fontSize: 12, fontWeight: 800, color: '#059669', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.5px' }}>
          4. Asset Health &amp; Maintenance Context
        </div>
        <Row gutter={12}>
          <Col span={6}>
            <Form.Item label="Asset Age (Years)" name="assetAgeYears">
              <InputNumber min={0} style={{ width: '100%' }} addonAfter="yrs" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Maint. Frequency" name="maintFreqDays">
              <InputNumber min={0} style={{ width: '100%' }} addonAfter="days" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Historical Failures" name="histFailures">
              <InputNumber min={0} style={{ width: '100%' }} addonAfter="count" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Required Window" name="workDurationHrs">
              <InputNumber min={0.5} step={0.5} style={{ width: '100%' }} addonAfter="hrs" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Inspection Diagnostic & Field Notes" name="observations">
          <Input.TextArea rows={2} placeholder="Describe point machine 102B calibration drift, relay contact oxidation, or track circuit voltage drop details..." />
        </Form.Item>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading} icon={<PlusOutlined />} style={{ background: '#d97706', borderColor: '#d97706' }}>
            SUBMIT DEFECT TO {dept} REGISTRY
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

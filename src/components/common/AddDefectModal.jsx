import React, { useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Upload, Button, Tag, Alert, message, Row, Col } from 'antd';
import { PlusOutlined, UploadOutlined, ToolOutlined, ThunderboltOutlined, BlockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

export const AddDefectModal = ({ open, onClose, defaultAsset = null, onDefectAdded }) => {
  const { currentUser } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const dept = currentUser?.department || 'TMS';

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
      { label: 'Point Machine Calibration Fault', value: 'Point Machine Fault' },
      { label: 'Track Circuit Failure / Glitch', value: 'Track Circuit Failure' },
      { label: 'Signal LED Blanking', value: 'Signal LED Blanking' },
      { label: 'Axle Counter Sensor Drift', value: 'Axle Counter Drift' },
      { label: 'Relay Interlocking Contact Corrosion', value: 'Relay Interlocking Contact' }
    ],
    TDMS: [
      { label: 'OHE Wire Tension Droop', value: 'OHE Wire Tension' },
      { label: 'Catenary Insulator Breakdown', value: 'Insulator Breakdown' },
      { label: 'Neutral Section Flashover', value: 'Neutral Section Flashover' },
      { label: 'Pantograph Strike Abrasion', value: 'Pantograph Strike' },
      { label: 'Substation Transformer Heating', value: 'Substation Heating' }
    ]
  };

  const handleFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const newDefectId = `${dept}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newDefect = {
        id: newDefectId,
        Defect_ID: newDefectId,
        department: dept,
        section: values.sectionId || 'LKO–CNB',
        location: `${values.station1 || 'LKO'} – ${values.station2 || 'CNB'} (KM ${values.chainage || '142.5'})`,
        assetId: values.assetId || defaultAsset?.id || `AST-${dept}-01`,
        defectType: values.defectCategory,
        severity: values.severity,
        reportedDate: new Date().toISOString().split('T')[0],
        status: 'Pending Block',
        reportedBy: currentUser?.name || 'Engineer'
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
          <span>LOG NEW MAINTENANCE DEFECT ({dept} DEPARTMENT)</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={650}
    >
      <Alert
        type="info"
        showIcon
        message={`LOGGING AS: ${currentUser?.name || 'Engineer'} (${currentUser?.designation})`}
        description="Submitting this defect updates Digital Twin layers, calculates severity SLA, and prompts BDMS block recommendation."
        style={{ marginBottom: 16, fontSize: 11 }}
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          sectionId: 'LKO–CNB',
          station1: 'Lucknow JN',
          station2: 'Kanpur Central',
          chainage: '142.50',
          severity: 'Critical',
          assetId: defaultAsset?.id || `AST-${dept}-01`
        }}
      >
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item label="Section ID" name="sectionId" rules={[{ required: true }]}>
              <Input placeholder="e.g. LKO–CNB" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Asset ID" name="assetId" rules={[{ required: true }]}>
              <Input placeholder="e.g. T-104 / S-BCN-01" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="From Station" name="station1" rules={[{ required: true }]}>
              <Input placeholder="Station 1" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="To Station" name="station2" rules={[{ required: true }]}>
              <Input placeholder="Station 2" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Chainage (KM)" name="chainage" rules={[{ required: true }]}>
              <Input placeholder="e.g. 142.50" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Severity Assessment" name="severity" rules={[{ required: true }]}>
              <Select options={[
                { label: 'Critical (S1 Immediate SLA +1 Day)', value: 'Critical' },
                { label: 'High (S2 Action SLA +3 Days)', value: 'High' },
                { label: 'Medium (S3 Planned SLA +7 Days)', value: 'Medium' },
                { label: 'Low (S4 Routine SLA +14 Days)', value: 'Low' }
              ]} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label={`${dept} Specific Defect Category`} name="defectCategory" rules={[{ required: true }]}>
          <Select options={defectCategories[dept] || defectCategories.TMS} placeholder="Select specific defect type" />
        </Form.Item>

        <Form.Item label="Inspection Observations & Field Notes" name="observations">
          <Input.TextArea rows={3} placeholder="Describe physical defect observations, track wear depth, insulation drop, or wire sag details..." />
        </Form.Item>

        <Form.Item label="Photo / TRC Telemetry Evidence Upload (Simulator)">
          <Upload maxCount={1} beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Attach Inspection Image / Telemetry Log</Button>
          </Upload>
        </Form.Item>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading} icon={<PlusOutlined />} style={{ background: '#0284c7', borderColor: '#0284c7' }}>
            SUBMIT DEFECT TO {dept} REGISTRY
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

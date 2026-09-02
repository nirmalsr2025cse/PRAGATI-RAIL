import React from 'react';
import { Row, Col, Card, Table, Tag, Button, Space, Progress, Tooltip } from 'antd';
import {
  RocketOutlined,
  UnorderedListOutlined,
  FileTextOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  MergeCellsOutlined,
  ToolOutlined,
  ThunderboltOutlined,
  BlockOutlined,
  RightOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../components/common/StatCard';
import { useRegion } from '../context/RegionContext';
import { ZONAL_PERFORMANCE_MATRIX } from '../mock/apiData';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    selectedZone,
    selectedDivision,
    dynamicStats,
    filteredDefects,
    filteredAlerts
  } = useRegion();

  const topPriorityTasks = filteredDefects.slice(0, 10);
  const recentAlerts = filteredAlerts.slice(0, 5);

  const deptTag = (dept) => {
    switch (dept) {
      case 'TMS': return <Tag color="blue" icon={<ToolOutlined />}>TMS Track</Tag>;
      case 'SMMS': return <Tag color="gold" icon={<ThunderboltOutlined />}>SMMS Signal</Tag>;
      case 'TDMS': return <Tag color="purple" icon={<BlockOutlined />}>TDMS OHE</Tag>;
      default: return <Tag color="default">{dept}</Tag>;
    }
  };

  const severityTag = (severity) => {
    switch (severity) {
      case 'Critical': return <Tag color="error">Critical (S1)</Tag>;
      case 'High': return <Tag color="warning">High (S2)</Tag>;
      case 'Medium': return <Tag color="processing">Medium (S3)</Tag>;
      default: return <Tag color="default">Low (S4)</Tag>;
    }
  };

  const columns = [
    { title: 'Defect ID', dataIndex: 'id', key: 'id', render: text => <strong style={{ fontFamily: 'monospace' }}>{text}</strong> },
    { title: 'Zone / Div', key: 'zoneDiv', render: (_, r) => <Tag color="geekblue">{r.zone} / {r.division}</Tag> },
    { title: 'Department', dataIndex: 'department', key: 'department', render: dept => deptTag(dept) },
    { title: 'Defect / Work Item', dataIndex: 'defectType', key: 'defectType' },
    { title: 'Location / Corridor', dataIndex: 'location', key: 'location', render: text => <span style={{ fontSize: 12 }}>{text}</span> },
    { title: 'Severity', dataIndex: 'severity', key: 'severity', render: sev => severityTag(sev) },
    {
      title: 'AI Priority Score',
      dataIndex: 'priorityScore',
      key: 'priorityScore',
      sorter: (a, b) => a.priorityScore - b.priorityScore,
      render: score => (
        <Space style={{ minWidth: 120 }}>
          <Progress 
            percent={score} 
            size="small" 
            status={score > 85 ? 'exception' : score > 70 ? 'active' : 'normal'}
            strokeColor={score > 85 ? '#dc2626' : score > 70 ? '#d97706' : '#059669'}
          />
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        if (status.includes('Merged')) return <Tag color="success" icon={<MergeCellsOutlined />}>Joint Merged</Tag>;
        if (status.includes('Approved')) return <Tag color="blue">Approved</Tag>;
        if (status.includes('Emergency')) return <Tag color="volcano">Emergency S1</Tag>;
        return <Tag color="gold">Pending</Tag>;
      }
    }
  ];

  const zonalMatrixColumns = [
    { title: 'Zone Code', dataIndex: 'zone', key: 'zone', render: z => <strong style={{ color: '#1e3a8a' }}>{z}</strong> },
    { title: 'Zone Name', dataIndex: 'zoneName', key: 'zoneName' },
    { title: 'Total Defects', dataIndex: 'totalDefects', key: 'totalDefects' },
    { title: 'Pending Blocks', dataIndex: 'pendingBlocks', key: 'pendingBlocks' },
    { title: 'Approved Blocks', dataIndex: 'approvedBlocks', key: 'approvedBlocks', render: a => <Tag color="blue">{a}</Tag> },
    { title: 'Block Hours Saved', dataIndex: 'hoursSaved', key: 'hoursSaved', render: h => <strong style={{ color: '#059669' }}>{h} hrs</strong> },
    { title: 'Joint Merge Rate', dataIndex: 'mergeRate', key: 'mergeRate', render: m => <Tag color="success">{m}</Tag> },
    { title: 'Critical S1', dataIndex: 'criticalDefects', key: 'criticalDefects', render: c => <Tag color="error">{c} S1</Tag> }
  ];

  const scopeLabel = selectedZone === 'ALL'
    ? 'All India National View (18 Zones)'
    : selectedDivision === 'ALL'
      ? `${selectedZone} Zonal View`
      : `${selectedDivision} Division (${selectedZone}) View`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Title & Quick Actions Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <GlobalOutlined style={{ color: '#0284c7' }} /> Indian Railways Joint Block Dashboard
          </h1>
          <p style={{ color: 'var(--ir-text-sub)', margin: 0, fontSize: 13 }}>
            Active Scope: <strong>{scopeLabel}</strong> • Multi-department maintenance optimization oversight
          </p>
        </div>

        <Space size="middle" style={{ flexWrap: 'wrap' }}>
          <Button 
            type="primary" 
            size="large"
            icon={<RocketOutlined />} 
            style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', border: 0, fontWeight: 600 }}
            onClick={() => navigate('/bdms-planner')}
          >
            Run Joint Optimization
          </Button>
          <Button icon={<UnorderedListOutlined />} onClick={() => navigate('/tms')}>
            View All Tasks
          </Button>
          <Button icon={<FileTextOutlined />} onClick={() => navigate('/reports')}>
            Generate Report
          </Button>
          <Button icon={<AlertOutlined />} danger onClick={() => navigate('/alerts')}>
            Manage Alerts
          </Button>
        </Space>
      </div>

      {/* Dynamic Stat Cards Grid */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={4}>
          <StatCard
            title="Total Defects"
            value={dynamicStats.totalDefects}
            trend={dynamicStats.totalDefectsTrend}
            icon={<ToolOutlined />}
            color="#1e3a8a"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <StatCard
            title="Pending Blocks"
            value={dynamicStats.pendingBlocks}
            trend={dynamicStats.pendingBlocksTrend}
            trendType="down"
            icon={<ClockCircleOutlined />}
            color="#d97706"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <StatCard
            title="Approved Blocks"
            value={dynamicStats.approvedBlocks}
            trend={dynamicStats.approvedBlocksTrend}
            icon={<CheckCircleOutlined />}
            color="#0284c7"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <StatCard
            title="Emergency S1"
            value={dynamicStats.emergencyBlocks}
            trend={dynamicStats.emergencyBlocksTrend}
            trendType="down"
            icon={<ExclamationCircleOutlined />}
            color="#dc2626"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <StatCard
            title="Block Hours Saved"
            value={dynamicStats.blockHoursSaved}
            suffix="hrs"
            trend={dynamicStats.blockHoursSavedTrend}
            icon={<ClockCircleOutlined />}
            color="#059669"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <StatCard
            title="Tasks Merged"
            value={dynamicStats.tasksMerged}
            trend={dynamicStats.tasksMergedTrend}
            icon={<MergeCellsOutlined />}
            color="#7c3aed"
          />
        </Col>
      </Row>

      {/* All India Zonal Performance Matrix Card (Shown in National or Zonal View) */}
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700 }}>
              <GlobalOutlined style={{ color: '#0284c7', marginRight: 6 }} /> All India Zonal Joint Block Performance Matrix
            </span>
            <Tag color="geekblue">Railway Board Oversight</Tag>
          </div>
        }
        style={{ borderRadius: 10, border: '1px solid var(--ir-border)' }}
      >
        <Table
          columns={zonalMatrixColumns}
          dataSource={ZONAL_PERFORMANCE_MATRIX}
          rowKey="zone"
          pagination={false}
          size="middle"
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* Priority Tasks Table & Recent Alerts Panel */}
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700 }}>Top Priority Maintenance Defects ({scopeLabel})</span>
                <Button type="link" onClick={() => navigate('/ai-responses')}>
                  View Explainability Model <RightOutlined />
                </Button>
              </div>
            }
            style={{ borderRadius: 10, border: '1px solid var(--ir-border)' }}
          >
            <Table
              columns={columns}
              dataSource={topPriorityTasks}
              rowKey="id"
              pagination={false}
              size="middle"
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#dc2626' }}>
                  <AlertOutlined /> Recent System Alerts
                </span>
                <Button type="link" onClick={() => navigate('/alerts')}>View All</Button>
              </div>
            }
            style={{ borderRadius: 10, border: '1px solid var(--ir-border)', height: '100%' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentAlerts.map(alert => (
                <div
                  key={alert.id}
                  onClick={() => navigate('/alerts')}
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    border: '1px solid var(--ir-border)',
                    background: alert.severity === 'Critical' ? 'rgba(220, 38, 38, 0.05)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  className="hover-card"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    {severityTag(alert.severity)}
                    <Tag color="geekblue">{alert.zone} / {alert.division}</Tag>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ir-text-main)' }}>{alert.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--ir-text-sub)', marginTop: 2 }}>{alert.location}</div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

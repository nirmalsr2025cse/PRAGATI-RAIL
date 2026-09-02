import React, { useState } from 'react';
import { Row, Col, Card, Table, Tag, Progress, Divider, Alert, Space, Typography, Tooltip } from 'antd';
import {
  RobotOutlined,
  CheckCircleOutlined,
  BulbOutlined,
  SwapOutlined,
  QuestionCircleOutlined,
  ClockCircleOutlined,
  MergeCellsOutlined
} from '@ant-design/icons';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { ALL_DEFECTS, MERGED_BLOCK_PROPOSALS, PRIORITY_WEIGHTS } from '../mock/apiData';

const { Title, Paragraph, Text } = Typography;

export const AIResponsesPage = () => {
  const [expandedRowKeys, setExpandedRowKeys] = useState(['TRK-2026-081', 'TRK-2026-084']);

  // Recharts Chart Data
  const priorityDistData = [
    { range: '90 - 100 (Critical)', count: 4, fill: '#dc2626' },
    { range: '75 - 89 (High)', count: 8, fill: '#d97706' },
    { range: '50 - 74 (Medium)', count: 12, fill: '#0284c7' },
    { range: '< 50 (Low)', count: 4, fill: '#64748b' }
  ];

  const deptSplitData = [
    { name: 'TMS Track', value: 45, color: '#3b82f6' },
    { name: 'SMMS Signal', value: 30, color: '#f59e0b' },
    { name: 'TDMS Traction OHE', value: 25, color: '#8b5cf6' }
  ];

  const durationAccuracyData = [
    { name: 'NDLS-CNB Corridor', unoptimized: 10.5, optimized: 4.0, saved: 6.5 },
    { name: 'NDLS-UMB Corridor', unoptimized: 7.5, optimized: 4.0, saved: 3.5 },
    { name: 'LKO-BSB Corridor', unoptimized: 5.0, optimized: 3.0, saved: 2.0 }
  ];

  const columns = [
    {
      title: 'Defect ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <strong style={{ fontFamily: 'monospace' }}>{id}</strong>
    },
    {
      title: 'Department',
      dataIndex: 'deptLabel',
      key: 'deptLabel'
    },
    {
      title: 'Defect Description',
      dataIndex: 'defectType',
      key: 'defectType'
    },
    {
      title: 'AI Priority Score',
      dataIndex: 'priorityScore',
      key: 'priorityScore',
      sorter: (a, b) => a.priorityScore - b.priorityScore,
      render: (score) => (
        <Tag color={score > 85 ? 'red' : score > 70 ? 'orange' : 'green'} style={{ fontWeight: 700, fontSize: 13 }}>
          {score} / 100
        </Tag>
      )
    },
    {
      title: 'Optimization Decision',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        if (status.includes('Merged')) return <Tag color="success" icon={<MergeCellsOutlined />}>Merged into Joint Block</Tag>;
        if (status.includes('Emergency')) return <Tag color="error">Emergency S1 Execution</Tag>;
        if (status.includes('Deferred')) return <Tag color="default">Deferred to Low Density Window</Tag>;
        return <Tag color="blue">Standalone Scheduled</Tag>;
      }
    }
  ];

  const expandedRowRender = (record) => {
    // Find matching proposal
    const proposal = MERGED_BLOCK_PROPOSALS.find(p => p.taskIds.includes(record.id));

    return (
      <div style={{ padding: '12px 20px', background: 'var(--ir-bg)', borderRadius: 8 }}>
        <Title level={5} style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <BulbOutlined style={{ color: '#d97706' }} /> AI Explainability & Formula Decomposition
        </Title>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div style={{ fontSize: 12, marginBottom: 8, fontWeight: 600 }}>
              Weighted Priority Score Formula Components:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Severity Weight (35%):</span>
                <strong>{record.severityScore} × 0.35 = {(record.severityScore * 0.35).toFixed(1)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Urgency Weight (25%):</span>
                <strong>{record.urgencyScore} × 0.25 = {(record.urgencyScore * 0.25).toFixed(1)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Asset Impact Weight (20%):</span>
                <strong>{record.assetImpactScore} × 0.20 = {(record.assetImpactScore * 0.20).toFixed(1)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Train Impact Weight (12%):</span>
                <strong>{record.trainImpactScore} × 0.12 = {(record.trainImpactScore * 0.12).toFixed(1)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Overdue Days Weight (8%):</span>
                <strong>{record.overdueDaysScore} × 0.08 = {(record.overdueDaysScore * 0.08).toFixed(1)}</strong>
              </div>
              <Divider style={{ margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: '#059669' }}>
                <span>Calculated Final Score:</span>
                <span>{record.priorityScore} / 100</span>
              </div>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div style={{ fontSize: 12, marginBottom: 8, fontWeight: 600 }}>
              Plain-English Operational Justification:
            </div>
            <Alert
              type={proposal ? "success" : "info"}
              showIcon
              message={
                proposal 
                  ? `Merged into Joint Block ${proposal.jointBlockCode}` 
                  : `Independent Execution Strategy`
              }
              description={
                proposal 
                  ? proposal.aiReasoning 
                  : `This task stands as a high-priority isolated defect requiring exclusive track possession or specialized emergency repair team, not conducive to co-occupancy.`
              }
            />
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <RobotOutlined style={{ color: '#0284c7' }} /> AI Optimization Results & Explainability Matrix
        </h1>
        <p style={{ color: 'var(--ir-text-sub)', margin: 0, fontSize: 13 }}>
          Transparent decision rationale, scoring decomposition, and before/after schedule optimization metrics
        </p>
      </div>

      {/* Before vs After Impact Banner */}
      <Card style={{ borderRadius: 10, background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)', color: '#fff' }}>
        <Row gutter={[20, 20]} align="middle">
          <Col xs={24} md={7}>
            <div style={{ textTransform: 'uppercase', fontSize: 11, letterSpacing: 1, opacity: 0.8 }}>Before Optimization</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>10.5 Block Hours</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>3 Separate Department Blocks (TMS + SMMS + TDMS)</div>
          </Col>

          <Col xs={24} md={2} style={{ textAlign: 'center' }}>
            <SwapOutlined style={{ fontSize: 28, color: '#10b981' }} />
          </Col>

          <Col xs={24} md={7}>
            <div style={{ textTransform: 'uppercase', fontSize: 11, letterSpacing: 1, color: '#10b981' }}>After AI Joint Merging</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4, color: '#10b981' }}>4.0 Block Hours</div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>1 Unified Joint Corridor Window</div>
          </Col>

          <Col xs={24} md={8}>
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: 16, borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#38bdf8' }}>Operational Savings Delta</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#4ade80', marginTop: 4 }}>
                6.5 Block Hours Saved (61.9% Reduction)
              </div>
              <div style={{ fontSize: 11, marginTop: 4, opacity: 0.9 }}>
                4 Train Detentions Avoided • 2 Division Conflicts Resolved
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Analytics Charts Row */}
      <Row gutter={[20, 20]}>
        <Col xs={24} md={8}>
          <Card title="Priority Score Distribution" style={{ borderRadius: 10, border: '1px solid var(--ir-border)' }}>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityDistData}>
                  <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="count" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="Single vs Merged Duration (Hrs)" style={{ borderRadius: 10, border: '1px solid var(--ir-border)' }}>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={durationAccuracyData}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="unoptimized" name="Single Dept (Hrs)" fill="#dc2626" />
                  <Bar dataKey="optimized" name="Joint Merged (Hrs)" fill="#059669" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="Department Maintenance Workload Share" style={{ borderRadius: 10, border: '1px solid var(--ir-border)' }}>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deptSplitData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                    {deptSplitData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend tick={{ fontSize: 11 }} />
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Optimization Results Table with Explainability Drawer */}
      <Card title="AI Priority Scoring & Decision Justification Matrix" style={{ borderRadius: 10, border: '1px solid var(--ir-border)' }}>
        <Table
          columns={columns}
          dataSource={ALL_DEFECTS}
          rowKey="id"
          expandedRowRender={expandedRowRender}
          expandedRowKeys={expandedRowKeys}
          onExpandedRowsChange={setExpandedRowKeys}
          pagination={{ pageSize: 5 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

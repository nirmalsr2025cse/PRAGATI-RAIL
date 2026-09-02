import React, { useState } from 'react';
import { Card, Row, Col, Button, Table, Tag, Segmented, Modal, Badge, Progress, Space, Alert, Tooltip, message, Descriptions, Divider } from 'antd';
import {
  RocketOutlined,
  DownloadOutlined,
  CalendarOutlined,
  MergeCellsOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SwapOutlined,
  InfoCircleOutlined,
  AlertOutlined,
  ToolOutlined,
  ThunderboltOutlined,
  BlockOutlined
} from '@ant-design/icons';
import { MERGED_BLOCK_PROPOSALS, GANTT_TIMELINE_DATA, ALL_DEFECTS } from '../mock/apiData';
import { exportReportToPDF } from '../utils/pdfExport';
import { exportReportToExcel } from '../utils/excelExport';

export const BDMSBlockPlannerPage = ({ userRole }) => {
  const [viewMode, setViewMode] = useState('Weekly Gantt');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [proposals, setProposals] = useState(MERGED_BLOCK_PROPOSALS);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const isReadOnly = userRole === 'Viewer';

  // Trigger AI Block Optimization
  const handleRunOptimization = () => {
    setIsOptimizing(true);
    message.loading({ content: 'Running Greedy + Local Search Block Schedule Optimizer...', key: 'optMsg' });

    setTimeout(() => {
      setIsOptimizing(false);
      message.success({
        content: 'Joint Block Optimization Complete! Merged 3 multi-department windows into Joint Blocks. 6.5 block-hours saved.',
        key: 'optMsg',
        duration: 4
      });
    }, 1800);
  };

  const handleApproveProposal = (id) => {
    setProposals(proposals.map(p => p.id === id ? { ...p, status: 'Approved' } : p));
    message.success(`Approved Joint Block Proposal ${id}`);
  };

  const handleRejectProposal = (id) => {
    setProposals(proposals.map(p => p.id === id ? { ...p, status: 'Rejected' } : p));
    message.info(`Rejected Joint Block Proposal ${id}. Tasks returned to single-dept queues.`);
  };

  const handleExportPDF = () => {
    const headers = ['Joint Code', 'Section', 'Combined Window', 'Merged Depts', 'Hours Saved', 'Status'];
    const rows = proposals.map(p => [p.jointBlockCode, p.section, p.combinedWindow, p.departmentsMerged.join(', '), `${p.hoursSaved} hrs`, p.status]);
    exportReportToPDF(
      'BDMS_Joint_Block_Optimization_Schedule',
      [
        { label: 'Total Proposals', value: proposals.length },
        { label: 'Cumulative Saved', value: '10.0 Block Hrs' },
        { label: 'Inter-Division Conflicts', value: '0 Unresolved' }
      ],
      headers,
      rows
    );
  };

  const handleExportExcel = () => {
    const headers = ['Joint Code', 'Section', 'Combined Window', 'Merged Depts', 'Hours Saved', 'Status', 'AI Reasoning'];
    const rows = proposals.map(p => [p.jointBlockCode, p.section, p.combinedWindow, p.departmentsMerged.join(', '), p.hoursSaved, p.status, p.aiReasoning]);
    exportReportToExcel('BDMS_Block_Planner_Schedule', 'JointBlocks', headers, rows);
  };

  // Open detail modal for block
  const handleOpenDetail = (blockItem) => {
    setSelectedBlock(blockItem);
    setIsDetailModalOpen(true);
  };

  const proposalColumns = [
    {
      title: 'Joint Block Code',
      dataIndex: 'jointBlockCode',
      key: 'jointBlockCode',
      render: text => <strong style={{ color: '#059669', fontFamily: 'monospace' }}>{text}</strong>
    },
    {
      title: 'Location / Corridor',
      dataIndex: 'section',
      key: 'section',
      render: text => <span style={{ fontWeight: 600 }}>{text}</span>
    },
    {
      title: 'Departments Merged',
      dataIndex: 'departmentsMerged',
      key: 'departmentsMerged',
      render: depts => (
        <Space wrap>
          {depts.map(d => (
            <Tag key={d} color={d.includes('TMS') ? 'blue' : d.includes('SMMS') ? 'gold' : 'purple'}>
              {d.split(' ')[0]}
            </Tag>
          ))}
        </Space>
      )
    },
    {
      title: 'Combined Window',
      dataIndex: 'combinedWindow',
      key: 'combinedWindow'
    },
    {
      title: 'Block Hours Saved',
      dataIndex: 'hoursSaved',
      key: 'hoursSaved',
      render: hrs => (
        <Tag color="success" icon={<ClockCircleOutlined />} style={{ fontWeight: 700 }}>
          {hrs} hrs saved
        </Tag>
      )
    },
    {
      title: 'AI Confidence',
      dataIndex: 'aiConfidence',
      key: 'aiConfidence',
      render: conf => <span style={{ color: '#0284c7', fontWeight: 600 }}>{conf}</span>
    },
    {
      title: 'Status / Actions',
      key: 'actions',
      render: (_, record) => {
        if (record.status === 'Approved') return <Tag color="success" icon={<CheckCircleOutlined />}>Approved</Tag>;
        if (record.status === 'Rejected') return <Tag color="default" icon={<CloseCircleOutlined />}>Rejected</Tag>;

        return (
          <Space>
            <Button
              size="small"
              type="primary"
              disabled={isReadOnly}
              style={{ background: '#059669' }}
              onClick={() => handleApproveProposal(record.id)}
            >
              Approve Joint
            </Button>
            <Button
              size="small"
              danger
              disabled={isReadOnly}
              onClick={() => handleRejectProposal(record.id)}
            >
              Reject
            </Button>
            <Button size="small" icon={<InfoCircleOutlined />} onClick={() => handleOpenDetail(record)}>
              Details
            </Button>
          </Space>
        );
      }
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header & Main Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <MergeCellsOutlined style={{ color: '#059669' }} /> BDMS Block Planner (Centerpiece Optimization Engine)
          </h1>
          <p style={{ color: 'var(--ir-text-sub)', margin: 0, fontSize: 13 }}>
            Intelligent multi-department maintenance window consolidation and joint block schedule optimization
          </p>
        </div>

        <Space size="middle" style={{ flexWrap: 'wrap' }}>
          <Segmented
            value={viewMode}
            onChange={setViewMode}
            options={[
              { label: 'Weekly Gantt', value: 'Weekly Gantt', icon: <ClockCircleOutlined /> },
              { label: 'Monthly Heatmap', value: 'Monthly Heatmap', icon: <CalendarOutlined /> }
            ]}
          />

          <Button
            type="primary"
            size="large"
            icon={<RocketOutlined spin={isOptimizing} />}
            loading={isOptimizing}
            disabled={isReadOnly}
            style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', border: 0, fontWeight: 700 }}
            onClick={handleRunOptimization}
          >
            Run Joint Optimization
          </Button>

          <Button icon={<DownloadOutlined />} onClick={handleExportPDF}>
            Export PDF Schedule
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExportExcel}>
            Export Excel
          </Button>
        </Space>
      </div>

      {/* Before / After Impact Analysis Summary Banner */}
      <Card style={{ borderRadius: 10, border: '1px solid var(--ir-border)' }}>
        <Row gutter={[20, 20]} align="middle">
          <Col xs={24} sm={8}>
            <div style={{ fontSize: 12, color: 'var(--ir-text-sub)', fontWeight: 600 }}>CUMULATIVE SINGLE-DEPT BLOCKS</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#dc2626', marginTop: 2 }}>
              10.5 Hours (3 Blocks)
            </div>
            <div style={{ fontSize: 11, color: 'var(--ir-text-sub)' }}>Separate track, signal, and traction windows</div>
          </Col>

          <Col xs={24} sm={8} style={{ borderLeft: '1px solid var(--ir-border)', borderRight: '1px solid var(--ir-border)' }}>
            <div style={{ fontSize: 12, color: 'var(--ir-text-sub)', fontWeight: 600 }}>OPTIMIZED JOINT MERGED WINDOW</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#059669', marginTop: 2 }}>
              4.0 Hours (1 Joint Block)
            </div>
            <div style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>Saves 6.5 Hours of asset unavailability</div>
          </Col>

          <Col xs={24} sm={8}>
            <div style={{ fontSize: 12, color: 'var(--ir-text-sub)', fontWeight: 600 }}>INTER-DIVISION TRAIN IMPACT</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0284c7', marginTop: 2 }}>
              4 Detentions Avoided
            </div>
            <div style={{ fontSize: 11, color: 'var(--ir-text-sub)' }}>Ambala (UMB) boundary coordination verified</div>
          </Col>
        </Row>
      </Card>

      {/* Interactive Gantt / Monthly View Switcher */}
      {viewMode === 'Weekly Gantt' ? (
        /* Interactive Gantt Viewport */
        <Card
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700 }}>Interactive 24-Hour Block Schedule Gantt Chart</span>
              <Space>
                <Tag color="#059669">■ Joint Merged Block</Tag>
                <Tag color="#3b82f6">■ TMS Track</Tag>
                <Tag color="#d97706">■ SMMS Signal</Tag>
                <Tag color="#7c3aed">■ TDMS OHE</Tag>
              </Space>
            </div>
          }
          style={{ borderRadius: 10, border: '1px solid var(--ir-border)' }}
        >
          {/* 24-Hour Gantt Timeline Grid Header */}
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: 900 }}>
              <div style={{ display: 'flex', borderBottom: '2px solid var(--ir-border)', paddingBottom: 8, fontWeight: 700, fontSize: 11 }}>
                <div style={{ width: 220, paddingLeft: 8 }}>SECTION / BLOCK TASK</div>
                {Array.from({ length: 24 }).map((_, hour) => (
                  <div key={hour} className="gantt-hour-cell" style={{ flex: 1 }}>
                    {hour < 10 ? `0${hour}:00` : `${hour}:00`}
                  </div>
                ))}
              </div>

              {/* Gantt Block Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
                {GANTT_TIMELINE_DATA.map(item => {
                  const leftPercent = (item.startHour / 24) * 100;
                  const widthPercent = (item.durationHrs / 24) * 100;

                  return (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center' }}>
                      {/* Left Title Label */}
                      <div style={{ width: 220, paddingRight: 12, fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <Tooltip title={item.title}>
                          <span>{item.title}</span>
                        </Tooltip>
                      </div>

                      {/* Right Timeline Bar Container */}
                      <div style={{ flex: 1, position: 'relative', height: 38, background: 'var(--ir-bg)', borderRadius: 6 }}>
                        <div
                          onClick={() => handleOpenDetail(item)}
                          className={`gantt-block-bar ${item.isJoint ? 'joint-merged-badge' : ''}`}
                          style={{
                            position: 'absolute',
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`,
                            height: '100%',
                            background: item.isJoint ? undefined : item.color,
                            borderRadius: 6,
                            padding: '4px 10px',
                            color: '#fff',
                            fontSize: 11,
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            overflow: 'hidden'
                          }}
                        >
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.isJoint && '★ JOINT MERGED: '} {item.tasks.join(', ')}
                          </span>
                          <span style={{ fontSize: 10, opacity: 0.9 }}>{item.durationHrs}h</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      ) : (
        /* Monthly Calendar Density Heatmap View */
        <Card title="Monthly Corridor Block Density Heatmap (30-Day Outlook)" style={{ borderRadius: 10, border: '1px solid var(--ir-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, padding: 12 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontWeight: 700, fontSize: 12, paddingBottom: 8, color: 'var(--ir-text-sub)' }}>
                {d}
              </div>
            ))}

            {Array.from({ length: 30 }).map((_, day) => {
              const dateNum = day + 1;
              const blockCount = (dateNum % 5 === 0) ? 3 : (dateNum % 3 === 0) ? 2 : 1;
              const isJointDay = dateNum % 4 === 0;

              return (
                <div
                  key={day}
                  style={{
                    height: 80,
                    border: '1px solid var(--ir-border)',
                    borderRadius: 6,
                    padding: 8,
                    background: isJointDay ? 'rgba(5, 150, 105, 0.08)' : 'transparent',
                    cursor: 'pointer'
                  }}
                  className="hover-card"
                  onClick={() => message.info(`Inspecting maintenance schedule for Day ${dateNum}`)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700 }}>
                    <span>Sep {dateNum}</span>
                    {isJointDay && <Badge status="success" text="Joint" />}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Tag color={isJointDay ? "success" : "blue"} style={{ fontSize: 10 }}>
                      {blockCount} {blockCount > 1 ? 'Blocks' : 'Block'}
                    </Tag>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Merged Block Proposals Table */}
      <Card title="AI Merged Block Proposals (Department Consolidation Engine)" style={{ borderRadius: 10, border: '1px solid var(--ir-border)' }}>
        <Table
          columns={proposalColumns}
          dataSource={proposals}
          rowKey="id"
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* Block Details Modal */}
      <Modal
        title={selectedBlock ? `Block Inspection: ${selectedBlock.jointBlockCode || selectedBlock.title}` : 'Block Details'}
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalOpen(false)}>Close</Button>,
          <Button key="pdf" type="primary" icon={<DownloadOutlined />} onClick={handleExportPDF}>Export PDF Summary</Button>
        ]}
        width={650}
      >
        {selectedBlock && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Corridor Section" span={2}>{selectedBlock.section}</Descriptions.Item>
              <Descriptions.Item label="Proposed Window">{selectedBlock.combinedWindow || '02:00 - 06:00'}</Descriptions.Item>
              <Descriptions.Item label="Merged Depts">{selectedBlock.departmentsMerged ? selectedBlock.departmentsMerged.join(', ') : 'Single Dept'}</Descriptions.Item>
              <Descriptions.Item label="Hours Saved">{selectedBlock.hoursSaved || '3.5'} Block Hours</Descriptions.Item>
              <Descriptions.Item label="AI Confidence">{selectedBlock.aiConfidence || '95.2%'}</Descriptions.Item>
            </Descriptions>

            <div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>Plain-English AI Optimization Justification:</div>
              <Alert
                type="success"
                showIcon
                message={selectedBlock.aiReasoning || 'Consolidated multi-department inspection to prevent multiple line possessions on the same day.'}
              />
            </div>

            <div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>Inter-Division Affected Express Trains:</div>
              <Table
                size="small"
                pagination={false}
                columns={[
                  { title: 'Train No.', dataIndex: 'number', key: 'number', render: t => <strong>{t}</strong> },
                  { title: 'Train Name', dataIndex: 'name', key: 'name' },
                  { title: 'Estimated Impact', dataIndex: 'delayEst', key: 'delayEst', render: d => <Tag color="orange">{d}</Tag> },
                ]}
                dataSource={selectedBlock.affectedTrains || [
                  { number: '12004', name: 'Kalka Shatabdi Express', delayEst: '12 min rerouted' },
                  { number: '12424', name: 'Dibrugarh Rajdhani', delayEst: 'On-time' }
                ]}
                rowKey="number"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

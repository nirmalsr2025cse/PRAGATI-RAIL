import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Tag,
  Segmented,
  Modal,
  Badge,
  Progress,
  Space,
  Alert,
  Tooltip,
  message,
  Descriptions,
  Divider,
  Statistic
} from 'antd';
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
  BlockOutlined,
  SafetyCertificateOutlined,
  CarOutlined,
  WarningOutlined,
  RobotOutlined,
  LineChartOutlined,
  CheckOutlined,
  RightOutlined
} from '@ant-design/icons';
import { exportReportToPDF } from '../utils/pdfExport';
import { exportReportToExcel } from '../utils/excelExport';

// Mock 24-Hour Train Operations & Maintenance Timeline Rows
const INITIAL_TIMELINE_ROWS = [
  {
    id: 'ROW-PASSENGER',
    category: 'PASSENGER TRAINS (MASTER CHART SLOTS)',
    deptLabel: 'Passenger Express Paths',
    color: '#0284c7',
    items: [
      { id: 'TRN-12424', label: '12424 Dibrugarh Rajdhani', start: 1.25, duration: 0.6, type: 'Passenger Express', details: 'Passes KM 142 Down Line at 01:15' },
      { id: 'TRN-12004', label: '12004 Kalka Shatabdi', start: 6.25, duration: 0.6, type: 'Passenger Express', details: 'Departs NDLS at 06:15' },
      { id: 'TRN-12302', label: '12302 Howrah Rajdhani', start: 16.75, duration: 0.75, type: 'Passenger Express', details: 'Passes KM 142 at 16:45' }
    ]
  },
  {
    id: 'ROW-GOODS',
    category: 'GOODS TRAINS (FREIGHT RAKE PATHS)',
    deptLabel: 'Goods Train Movement',
    color: '#64748b',
    items: [
      { id: 'FRT-2401', label: 'BCN Freight Rake 2401 (Path Shifted)', start: 2.0, duration: 0.75, type: 'Goods Train', details: 'Rescheduled to 05:45 window for block execution' },
      { id: 'FRT-8821', label: 'Coal Rake Freight 8821', start: 11.0, duration: 1.0, type: 'Goods Train', details: 'Passing window on Up Line' }
    ]
  },
  {
    id: 'ROW-TMS',
    category: 'TMS TRACK MAINTENANCE',
    deptLabel: 'TMS Track Maintenance',
    color: '#0284c7',
    items: [
      { id: 'TRK-2026-081', label: 'TRK-081 USFD Rail Flaw Weld', start: 2.0, duration: 3.5, type: 'Line Block', details: 'NDLS-CNB Down Line (KM 142.450)' }
    ]
  },
  {
    id: 'ROW-SMMS',
    category: 'SMMS SIGNAL & TELECOM',
    deptLabel: 'SMMS Signal Maintenance',
    color: '#d97706',
    items: [
      { id: 'SIG-2026-042', label: 'SIG-042 Point Machine 102B Overhaul', start: 2.5, duration: 3.0, type: 'Disconnection Block', details: 'NDLS-CNB Down Line (KM 142.100)' }
    ]
  },
  {
    id: 'ROW-TDMS',
    category: 'TDMS TRACTION OHE',
    deptLabel: 'TDMS OHE Maintenance',
    color: '#7c3aed',
    items: [
      { id: 'TRC-2026-031', label: 'TRC-031 Insulator Replacement', start: 2.25, duration: 3.5, type: 'Power Block', details: 'NDLS-CNB Down Line (Mast 142/14)' }
    ]
  },
  {
    id: 'ROW-INTEGRATED',
    category: 'RECOMMENDED INTEGRATED BLOCK',
    deptLabel: 'Integrated Block',
    color: '#059669',
    isIntegrated: true,
    items: [
      { id: 'JB-2026-901', label: '★ INTEGRATED BLOCK: TRK-081 + SIG-042 + TRC-031', start: 2.5, duration: 3.0, type: 'Integrated Block', details: 'Optimized Combined Window: 02:30 - 05:30 (3.0 hrs)' }
    ]
  }
];

// Mock Block Requests Dataset
const INITIAL_BLOCK_REQUESTS = [
  {
    id: 'REQ-2026-001',
    blockId: 'JB-2026-901',
    department: 'Joint (TMS + SMMS + TDMS)',
    section: 'SEC-NDLS-CNB-DN',
    location: 'NDLS-CNB Down Line (KM 142.100 - 142.450)',
    station1: 'Lucknow JN',
    station2: 'Kanpur Central',
    blockType: 'Integrated Block',
    requestedStart: '02:00',
    requestedEnd: '05:30',
    recommendedStart: '02:30',
    recommendedEnd: '05:30',
    durationHours: 3.0,
    singleDeptHours: 10.5,
    hoursSaved: 6.5,
    reason: 'Joint USFD Rail Weld, Point Machine 102B Overhaul, and OHE Insulator Replacement',
    priority: 'Critical (S1)',
    trainImpact: '0 Passenger / 1 Freight Shift',
    feasibilityScore: 92.5,
    status: 'Joint Feasible'
  },
  {
    id: 'REQ-2026-002',
    blockId: 'BLK-TRK-084',
    department: 'TMS (Engineering)',
    section: 'SEC-NDLS-UMB-UP',
    location: 'NDLS-UMB Up Line (KM 48.120)',
    station1: 'New Delhi',
    station2: 'Ambala Cantt',
    blockType: 'Line Block',
    requestedStart: '13:00',
    requestedEnd: '17:00',
    recommendedStart: '13:30',
    recommendedEnd: '17:30',
    durationHours: 4.0,
    singleDeptHours: 4.0,
    hoursSaved: 0,
    reason: 'Ballast Deep Screening Machine Operation',
    priority: 'High (S2)',
    trainImpact: '1 Freight Rake Adjustment',
    feasibilityScore: 84.0,
    status: 'Pending Review'
  },
  {
    id: 'REQ-2026-003',
    blockId: 'BLK-TRC-038',
    department: 'TDMS (Traction OHE)',
    section: 'SEC-NDLS-UMB-UP',
    location: 'NDLS-UMB Up Line (KM 48.150)',
    station1: 'New Delhi',
    station2: 'Ambala Cantt',
    blockType: 'Power Block',
    requestedStart: '03:00',
    requestedEnd: '07:00',
    recommendedStart: '03:00',
    recommendedEnd: '07:00',
    durationHours: 4.0,
    singleDeptHours: 4.0,
    hoursSaved: 0,
    reason: 'OHE Catenary Wire Dropper Adjustment',
    priority: 'High (S2)',
    trainImpact: '0 Passenger Conflicts',
    feasibilityScore: 88.0,
    status: 'Approved'
  }
];

export const BDMSBlockPlannerPage = ({ userRole }) => {
  const [viewMode, setViewMode] = useState('24-Hour Master Schedule');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [blockRequests, setBlockRequests] = useState(INITIAL_BLOCK_REQUESTS);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDayModalOpen, setSelectedDayModalOpen] = useState(false);
  const [selectedDayData, setSelectedDayData] = useState(null);

  const isReadOnly = userRole === 'Viewer';

  // Run Optimization Trigger
  const handleRunOptimization = () => {
    setIsOptimizing(true);
    message.loading({ content: 'Evaluating Available Corridor Windows & Train Path Constraints...', key: 'optMsg' });

    setTimeout(() => {
      setIsOptimizing(false);
      message.success({
        content: 'AI-Assisted Joint Block Optimization Complete! Merged TMS, SMMS & TDMS into 1 Integrated Block. 6.5 block-hours saved with zero passenger train detention.',
        key: 'optMsg',
        duration: 4
      });
    }, 1500);
  };

  const handleApproveBlock = (id) => {
    setBlockRequests(blockRequests.map(b => b.id === id ? { ...b, status: 'Approved' } : b));
    message.success(`Approved Integrated Block Request ${id}`);
  };

  const handleRejectBlock = (id) => {
    setBlockRequests(blockRequests.map(b => b.id === id ? { ...b, status: 'Rejected' } : b));
    message.info(`Rejected Block Request ${id}. Returned to single-department queues.`);
  };

  const handleExportPDF = () => {
    const headers = ['Block Request ID', 'Section', 'Block Type', 'Departments', 'Requested Window', 'Recommended Window', 'Hours Saved', 'Status'];
    const rows = blockRequests.map(b => [b.blockId, b.section, b.blockType, b.department, `${b.requestedStart}-${b.requestedEnd}`, `${b.recommendedStart}-${b.recommendedEnd}`, `${b.hoursSaved} hrs`, b.status]);
    exportReportToPDF(
      'BDMS_Integrated_Block_Schedule',
      [
        { label: 'Total Block Requests', value: blockRequests.length },
        { label: 'Cumulative Hours Saved', value: '6.5 Block Hrs' },
        { label: 'Passenger Detention', value: '0 Minutes' }
      ],
      headers,
      rows
    );
  };

  const handleExportExcel = () => {
    const headers = ['Block Request ID', 'Section', 'Block Type', 'Departments', 'Requested Window', 'Recommended Window', 'Duration', 'Hours Saved', 'Feasibility', 'Status', 'Train Impact'];
    const rows = blockRequests.map(b => [b.blockId, b.section, b.blockType, b.department, `${b.requestedStart}-${b.requestedEnd}`, `${b.recommendedStart}-${b.recommendedEnd}`, b.durationHours, b.hoursSaved, `${b.feasibilityScore}%`, b.status, b.trainImpact]);
    exportReportToExcel('BDMS_Integrated_Block_Schedule', 'IntegratedBlocks', headers, rows);
  };

  const handleOpenDetail = (blockItem) => {
    setSelectedBlock(blockItem);
    setIsDetailModalOpen(true);
  };

  const blockColumns = [
    {
      title: 'Block ID',
      dataIndex: 'blockId',
      key: 'blockId',
      render: (text, r) => (
        <strong style={{ color: r.blockType === 'Integrated Block' ? '#059669' : '#1e3a8a', fontFamily: 'monospace' }}>
          {text}
        </strong>
      )
    },
    {
      title: 'Location / Section',
      dataIndex: 'section',
      key: 'section',
      render: (s, r) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--ir-text-main)' }}>{s}</div>
          <div style={{ fontSize: 11, color: 'var(--ir-text-sub)' }}>{r.location}</div>
        </div>
      )
    },
    {
      title: 'Block Type',
      dataIndex: 'blockType',
      key: 'blockType',
      render: bt => (
        <Tag color={bt === 'Integrated Block' ? 'green' : bt === 'Line Block' ? 'blue' : bt === 'Power Block' ? 'purple' : 'gold'}>
          {bt}
        </Tag>
      )
    },
    {
      title: 'Participating Departments',
      dataIndex: 'department',
      key: 'department',
      render: d => <Tag color="geekblue">{d}</Tag>
    },
    {
      title: 'Requested Window',
      key: 'requested',
      render: (_, r) => <span style={{ fontSize: 13 }}>{r.requestedStart} - {r.requestedEnd} ({r.durationHours}h)</span>
    },
    {
      title: 'Recommended Window',
      key: 'recommended',
      render: (_, r) => (
        <Tag color="success" style={{ fontWeight: 700, fontSize: 12 }}>
          {r.recommendedStart} - {r.recommendedEnd}
        </Tag>
      )
    },
    {
      title: 'Hours Saved',
      dataIndex: 'hoursSaved',
      key: 'hoursSaved',
      render: hrs => hrs > 0 ? <Tag color="success" style={{ fontWeight: 700 }}>+{hrs} hrs saved</Tag> : <span style={{ color: 'var(--ir-text-sub)' }}>0 hrs</span>
    },
    {
      title: 'Projected Train Impact',
      dataIndex: 'trainImpact',
      key: 'trainImpact',
      render: ti => <Tag color={ti.includes('0 Passenger') ? 'blue' : 'orange'}>{ti}</Tag>
    },
    {
      title: 'Feasibility',
      dataIndex: 'feasibilityScore',
      key: 'feasibilityScore',
      render: fs => <span style={{ color: '#059669', fontWeight: 800 }}>{fs}%</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: st => <Tag color={st === 'Approved' ? 'blue' : st === 'Joint Feasible' ? 'green' : 'gold'}>{st}</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        if (record.status === 'Approved') return <Tag color="blue" icon={<CheckCircleOutlined />}>Approved</Tag>;
        if (record.status === 'Rejected') return <Tag color="default" icon={<CloseCircleOutlined />}>Rejected</Tag>;

        return (
          <Space size="small">
            <Button
              size="small"
              type="primary"
              disabled={isReadOnly}
              style={{ background: '#059669', borderColor: '#059669' }}
              onClick={() => handleApproveBlock(record.id)}
            >
              Approve
            </Button>
            <Button
              size="small"
              danger
              disabled={isReadOnly}
              onClick={() => handleRejectBlock(record.id)}
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
    <div style={{ maxWidth: 1560, width: 'calc(100% - 32px)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 32 }}>
      
      {/* 1. TOP ACTION BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ir-text-main)' }}>
            <MergeCellsOutlined style={{ color: '#059669' }} /> BDMS Block Planner (Integrated Maintenance Window Engine)
          </h1>
          <p style={{ color: 'var(--ir-text-sub)', margin: 0, fontSize: 13 }}>
            Multi-department maintenance window coordination, train path constraints, and joint block schedule optimization
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Segmented
            value={viewMode}
            onChange={setViewMode}
            style={{ height: 42, display: 'flex', alignItems: 'center' }}
            options={[
              { label: '24-Hour Master Schedule', value: '24-Hour Master Schedule', icon: <ClockCircleOutlined /> },
              { label: 'Maintenance Demand vs Available Windows', value: 'Maintenance Demand vs Available Windows', icon: <CalendarOutlined /> }
            ]}
          />

          <Button
            type="primary"
            icon={<RocketOutlined spin={isOptimizing} />}
            loading={isOptimizing}
            disabled={isReadOnly}
            style={{
              height: 42,
              padding: '0 20px',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              borderColor: '#059669',
              fontWeight: 700,
              fontSize: 13,
              borderRadius: 8
            }}
            onClick={handleRunOptimization}
          >
            RUN AI-ASSISTED OPTIMIZATION
          </Button>

          <Button icon={<DownloadOutlined />} style={{ height: 42, borderRadius: 8 }} onClick={handleExportPDF}>
            Export PDF
          </Button>
          <Button icon={<DownloadOutlined />} style={{ height: 42, borderRadius: 8 }} onClick={handleExportExcel}>
            Export Excel
          </Button>
        </div>
      </div>

      {/* 2. KPI SECTION (4 COMPACT EQUAL HEIGHT CARDS) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {/* KPI 1 */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 130,
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ir-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            CUMULATIVE SINGLE-DEPT BLOCKS
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#dc2626', margin: '4px 0' }}>
            10.5 Hours
          </div>
          <div style={{ fontSize: 12, color: 'var(--ir-text-sub)' }}>
            3 Separate Departmental Windows
          </div>
        </div>

        {/* KPI 2 */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 130,
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ir-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            OPTIMIZED INTEGRATED BLOCK
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#059669', margin: '4px 0' }}>
            4.0 Hours
          </div>
          <div style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>
            1 Consolidated Joint Window
          </div>
        </div>

        {/* KPI 3 */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 130,
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ir-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            PROJECTED BLOCK REDUCTION
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0284c7', margin: '4px 0' }}>
            6.5 Hours Saved
          </div>
          <div style={{ fontSize: 12, color: '#0284c7', fontWeight: 600 }}>
            61.9% Corridor Occupancy Reduction
          </div>
        </div>

        {/* KPI 4 */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 130,
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ir-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            PROJECTED TRAIN IMPACT
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#059669', margin: '4px 0' }}>
            0 Min Projected Detention
          </div>
          <div style={{ fontSize: 12, color: 'var(--ir-text-sub)' }}>
            0 Passenger Conflicts | 1 Freight Rake Shift
          </div>
        </div>
      </div>

      {/* 3. CORRIDOR + AI RECOMMENDATION SECTION (PROPER 2-COLUMN GRID) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.55fr) minmax(360px, 1fr)', gap: 20 }}>
        
        {/* LEFT COLUMN: CORRIDOR WINDOW TILES */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: 8 }}>
              <CalendarOutlined style={{ color: '#0284c7' }} /> AVAILABLE TRAFFIC CORRIDOR WINDOW &amp; MASTER CHART CONTEXT
            </div>
            <div style={{ fontSize: 12, color: 'var(--ir-text-sub)', marginTop: 4 }}>
              TARGET CORRIDOR SECTION: <strong style={{ color: 'var(--ir-text-main)' }}>NDLS - CNB Down Line (KM 142.100 – 142.450)</strong>
            </div>
          </div>

          {/* 2x2 Clean Tile Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {/* Tile 1 */}
            <div style={{ background: 'rgba(2, 132, 199, 0.04)', border: '1px solid rgba(2, 132, 199, 0.15)', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>
                AVAILABLE CORRIDOR WINDOW
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#0284c7', margin: '2px 0' }}>
                02:10 – 06:00
              </div>
              <div style={{ fontSize: 12, color: 'var(--ir-text-sub)' }}>
                3h 50m available timetable window
              </div>
            </div>

            {/* Tile 2 */}
            <div style={{ background: 'rgba(5, 150, 105, 0.04)', border: '1px solid rgba(5, 150, 105, 0.15)', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
                PASSENGER TRAIN CONFLICTS
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#059669', margin: '2px 0' }}>
                0 Conflicts
              </div>
              <div style={{ fontSize: 12, color: 'var(--ir-text-sub)' }}>
                Clear of scheduled passenger express paths
              </div>
            </div>

            {/* Tile 3 */}
            <div style={{ background: 'rgba(217, 119, 6, 0.04)', border: '1px solid rgba(217, 119, 6, 0.15)', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#d97706', textTransform: 'uppercase' }}>
                GOODS TRAIN ADJUSTMENTS
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#d97706', margin: '2px 0' }}>
                1 Freight Rake Shift
              </div>
              <div style={{ fontSize: 12, color: 'var(--ir-text-sub)' }}>
                Path 2401 rescheduled to 05:45 window
              </div>
            </div>

            {/* Tile 4 */}
            <div style={{ background: 'rgba(124, 58, 237, 0.04)', border: '1px solid rgba(124, 58, 237, 0.15)', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase' }}>
                FEASIBLE MAINTENANCE TASKS
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#7c3aed', margin: '2px 0' }}>
                3 Tasks Feasible
              </div>
              <div style={{ fontSize: 12, color: 'var(--ir-text-sub)' }}>
                Consolidates TMS + SMMS + TDMS
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI RECOMMENDATION CARD */}
        <div style={{ background: '#ffffff', border: '1px solid #059669', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 6 }}>
              <RobotOutlined /> AI-ASSISTED BLOCK RECOMMENDATION
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ir-text-sub)', marginTop: 4 }}>
              RECOMMENDED INTEGRATED BLOCK WINDOW
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#059669', margin: '2px 0' }}>
              02:30 – 05:30 <span style={{ fontSize: 16, fontWeight: 600 }}>(3.0 Hours)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '8px 0' }}>
              <Tag color="green" style={{ fontWeight: 700, fontSize: 11 }}>Joint Feasibility Score: 92.5%</Tag>
              <Tag color="blue" style={{ fontWeight: 700, fontSize: 11 }}>INTEGRATED BLOCK FEASIBLE</Tag>
            </div>

            <p style={{ fontSize: 12, color: 'var(--ir-text-sub)', margin: '8px 0 12px 0', lineHeight: 1.5 }}>
              3 compatible maintenance tasks can be consolidated within the available corridor window while avoiding projected passenger-train conflicts.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ir-text-sub)', textTransform: 'uppercase' }}>DEPARTMENTS:</span>
              <Tag color="blue" style={{ fontSize: 11 }}>TMS</Tag>
              <Tag color="gold" style={{ fontSize: 11 }}>SMMS</Tag>
              <Tag color="purple" style={{ fontSize: 11 }}>TDMS</Tag>
            </div>

            <div style={{ fontSize: 11, color: '#059669', fontWeight: 600, background: 'rgba(5, 150, 105, 0.06)', padding: '6px 10px', borderRadius: 6 }}>
              PROJECTED EFFECT: 6.5 hours of separate block demand consolidated into a 3.0-hour integrated window.
            </div>
          </div>

          <Button
            type="default"
            icon={<RightOutlined />}
            style={{ width: '100%', borderColor: '#059669', color: '#059669', fontWeight: 700 }}
            onClick={() => handleOpenDetail(INITIAL_BLOCK_REQUESTS[0])}
          >
            VIEW OPTIMIZATION DETAILS
          </Button>
        </div>
      </div>

      {/* 4. 24-HOUR MASTER SCHEDULE TIMELINE */}
      {viewMode === '24-Hour Master Schedule' ? (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
          {/* Header & Compact Legend */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ir-text-main)' }}>
              24-Hour Master Schedule &amp; Train Path Constraints Timeline
            </div>
            
            {/* Compact Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', fontSize: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#0284c7' }} /> Passenger Trains</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#64748b' }} /> Goods Trains</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#0284c7' }} /> TMS Track</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#d97706' }} /> SMMS Signal</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#7c3aed' }} /> TDMS OHE</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#059669' }} /> Integrated Block</span>
            </div>
          </div>

          {/* Horizontally Scrollable Timeline Container */}
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 8 }}>
            <div style={{ minWidth: 1100 }}>
              {/* Sticky Hourly Grid Header */}
              <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', paddingBottom: 8, paddingTop: 8, fontWeight: 700, fontSize: 11, background: '#f8fafc', position: 'sticky', top: 0, zIndex: 5 }}>
                <div style={{ width: 220, minWidth: 220, paddingLeft: 12, color: 'var(--ir-text-sub)' }}>TIMELINE ROW / TRAIN PATH</div>
                {Array.from({ length: 24 }).map((_, hour) => (
                  <div key={hour} style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid #f1f5f9', color: 'var(--ir-text-sub)' }}>
                    {hour < 10 ? `0${hour}:00` : `${hour}:00`}
                  </div>
                ))}
              </div>

              {/* Timeline Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 0' }}>
                {INITIAL_TIMELINE_ROWS.map(row => (
                  <div key={row.id} style={{ display: 'flex', alignItems: 'center' }}>
                    {/* Fixed Left Row Label */}
                    <div style={{ width: 220, minWidth: 220, paddingRight: 12, paddingLeft: 12, fontSize: 12, fontWeight: 700, color: row.isIntegrated ? '#059669' : 'var(--ir-text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <Tooltip title={row.category}>
                        <span>{row.deptLabel}</span>
                      </Tooltip>
                    </div>

                    {/* Timeline Bar Track */}
                    <div style={{ flex: 1, position: 'relative', height: 34, background: row.isIntegrated ? 'rgba(5, 150, 105, 0.05)' : '#f8fafc', borderRadius: 6, border: '1px solid #f1f5f9' }}>
                      {row.items.map(item => {
                        const leftPercent = (item.start / 24) * 100;
                        const widthPercent = (item.duration / 24) * 100;

                        return (
                          <Tooltip key={item.id} title={`${item.label} (${item.details || item.type})`}>
                            <div
                              style={{
                                position: 'absolute',
                                left: `${leftPercent}%`,
                                width: `${Math.max(widthPercent, 3)}%`,
                                height: '100%',
                                background: row.color,
                                borderRadius: 5,
                                padding: '0 8px',
                                color: '#ffffff',
                                fontSize: 11,
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                cursor: 'pointer',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                              }}
                              onClick={() => handleOpenDetail(item)}
                            >
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.label}
                              </span>
                              <span style={{ fontSize: 9, opacity: 0.9, marginLeft: 4 }}>{item.duration ? `${item.duration}h` : ''}</span>
                            </div>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Monthly Calendar Heatmap View */
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ir-text-main)', marginBottom: 12 }}>
            Monthly Maintenance Demand vs Available Corridor Windows (30-Day Outlook)
          </div>
          <Alert
            type="info"
            showIcon
            message="MAINTENANCE DEMAND VS. CORRIDOR AVAILABILITY HEATMAP"
            description="Click on any date cell to inspect recommended corridor maintenance windows, train density constraints, and multi-department joint block feasibility."
            style={{ marginBottom: 16, fontSize: 12 }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontWeight: 800, fontSize: 12, paddingBottom: 8, color: 'var(--ir-text-sub)' }}>
                {d}
              </div>
            ))}

            {Array.from({ length: 30 }).map((_, day) => {
              const dateNum = day + 1;
              const isHighDemand = dateNum % 3 === 0;
              const isJointDay = dateNum % 4 === 0;
              const availableWindow = isJointDay ? '02:10–06:00 (3.8h)' : '01:30–04:30 (3.0h)';
              const demandText = isHighDemand ? 'HIGH DEMAND' : 'MEDIUM DEMAND';

              return (
                <div
                  key={day}
                  style={{
                    minHeight: 85,
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    padding: 10,
                    background: isJointDay ? 'rgba(5, 150, 105, 0.06)' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                  className="hover-card"
                  onClick={() => {
                    setSelectedDayData({ dateNum, availableWindow, demandText, isJointDay });
                    setSelectedDayModalOpen(true);
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800 }}>
                    <span>Sep {dateNum}</span>
                    {isJointDay && <Tag color="green" style={{ fontSize: 9, margin: 0 }}>Joint Window</Tag>}
                  </div>

                  <div style={{ marginTop: 4 }}>
                    <div style={{ fontSize: 10, color: 'var(--ir-text-sub)' }}>Window:</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#0284c7' }}>{availableWindow}</div>
                  </div>

                  <div style={{ marginTop: 4 }}>
                    <Tag color={isHighDemand ? 'orange' : 'blue'} style={{ fontSize: 9, margin: 0 }}>
                      {demandText}
                    </Tag>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. MULTI-DEPARTMENT READINESS & AI RECOMMENDATION JUSTIFICATION */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)', gap: 20 }}>
        {/* Left: Department Participation */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#059669' }}>
            JOINT BLOCK PARTICIPATING DEPARTMENTS
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(2, 132, 199, 0.04)', border: '1px solid rgba(2, 132, 199, 0.15)', borderRadius: 8 }}>
              <div>
                <strong style={{ color: '#0284c7', fontSize: 13 }}>✓ TMS — Track Engineering</strong>
                <div style={{ fontSize: 11, color: 'var(--ir-text-sub)' }}>TRK-2026-081 Rail Flaw USFD Weld</div>
              </div>
              <Tag color="green" style={{ fontWeight: 700 }}>READY</Tag>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(217, 119, 6, 0.04)', border: '1px solid rgba(217, 119, 6, 0.15)', borderRadius: 8 }}>
              <div>
                <strong style={{ color: '#d97706', fontSize: 13 }}>✓ SMMS — Signal &amp; Telecom</strong>
                <div style={{ fontSize: 11, color: 'var(--ir-text-sub)' }}>SIG-2026-042 Point Machine 102B</div>
              </div>
              <Tag color="green" style={{ fontWeight: 700 }}>READY</Tag>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(124, 58, 237, 0.04)', border: '1px solid rgba(124, 58, 237, 0.15)', borderRadius: 8 }}>
              <div>
                <strong style={{ color: '#7c3aed', fontSize: 13 }}>✓ TDMS — Traction OHE</strong>
                <div style={{ fontSize: 11, color: 'var(--ir-text-sub)' }}>TRC-2026-031 Insulator Replace</div>
              </div>
              <Tag color="green" style={{ fontWeight: 700 }}>READY</Tag>
            </div>
          </div>
        </div>

        {/* Right: AI Recommendation Justification */}
        <div style={{ background: '#ffffff', border: '1px solid #059669', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#059669', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <RobotOutlined /> AI-ASSISTED BLOCK RECOMMENDATION &amp; EXPLANATION
          </div>
          <Alert
            type="success"
            showIcon
            message="RECOMMENDED INTEGRATED BLOCK (NDLS-CNB Down Line | 02:30 – 05:30)"
            description={
              <ol style={{ margin: '8px 0 0 0', paddingLeft: 16, fontSize: 12, lineHeight: 1.6 }}>
                <li><strong>Compatible Locations:</strong> All 3 tasks fall between KM 142.100 &amp; 142.450 on NDLS-CNB Down Line.</li>
                <li><strong>Overlapping Work Windows:</strong> Track welding, point overhaul, &amp; OHE power block execute concurrently.</li>
                <li><strong>Corridor Window Alignment:</strong> Fits within the 02:10 – 06:00 available traffic corridor window.</li>
                <li><strong>Zero Passenger Train Conflict:</strong> Dibrugarh Rajdhani clears at 01:15; Kalka Shatabdi departs at 06:15.</li>
                <li><strong>Freight Rake Reschedule:</strong> Container Rake 2401 shifted to 05:45 slot without detention.</li>
              </ol>
            }
          />
        </div>
      </div>

      {/* 6. AI-ASSISTED INTEGRATED BLOCK RECOMMENDATIONS TABLE */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ir-text-main)' }}>
            AI-Assisted Integrated Block Recommendations
          </div>
          <Tag color="blue">Official DRM / Control Office Protocol</Tag>
        </div>
        
        <Table
          columns={blockColumns}
          dataSource={blockRequests}
          rowKey="id"
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </div>

      {/* Block Details Modal */}
      <Modal
        title={selectedBlock ? `Block Inspection: ${selectedBlock.blockId || selectedBlock.label}` : 'Block Details'}
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
              <Descriptions.Item label="Corridor Section" span={2}>{selectedBlock.section || selectedBlock.details}</Descriptions.Item>
              <Descriptions.Item label="Block Type">
                <Tag color="green">{selectedBlock.blockType || 'Integrated Block'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Requested Window">{selectedBlock.requestedStart ? `${selectedBlock.requestedStart} - ${selectedBlock.requestedEnd}` : '02:00 - 05:30'}</Descriptions.Item>
              <Descriptions.Item label="Recommended Window">
                <strong style={{ color: '#059669' }}>{selectedBlock.recommendedStart ? `${selectedBlock.recommendedStart} - ${selectedBlock.recommendedEnd}` : '02:30 - 05:30'}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Cumulative Hours Saved">{selectedBlock.hoursSaved || '6.5'} Block Hours</Descriptions.Item>
              <Descriptions.Item label="Joint Feasibility">{selectedBlock.feasibilityScore ? `${selectedBlock.feasibilityScore}%` : '92.5%'}</Descriptions.Item>
              <Descriptions.Item label="Projected Train Impact">{selectedBlock.trainImpact || '0 Passenger Conflicts'}</Descriptions.Item>
            </Descriptions>

            <div>
              <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 6, color: '#059669' }}>AI Optimization Reasoning:</div>
              <Alert
                type="success"
                showIcon
                message={selectedBlock.reason || 'Consolidated track USFD weld, signal point overhaul, and catenary power shutdown into a single 3.0-hour window.'}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Monthly Heatmap Day Detail Modal */}
      <Modal
        title={`Corridor Window Details: Day ${selectedDayData?.dateNum || ''} September 2026`}
        open={selectedDayModalOpen}
        onCancel={() => setSelectedDayModalOpen(false)}
        footer={[<Button key="close" onClick={() => setSelectedDayModalOpen(false)}>Close</Button>]}
      >
        {selectedDayData && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Available Window Slot">
              <strong style={{ color: '#0284c7' }}>{selectedDayData.availableWindow}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Maintenance Demand">
              <Tag color={selectedDayData.demandText.includes('HIGH') ? 'orange' : 'blue'}>{selectedDayData.demandText}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Joint Block Opportunity">
              {selectedDayData.isJointDay ? <Tag color="green">FEASIBLE (TMS + SMMS + TDMS)</Tag> : <Tag color="default">Single-Department Window</Tag>}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Tag, Button, Table, Space, Badge, Segmented, Drawer, Descriptions, Alert, Divider } from 'antd';
import {
  RobotOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { COMMAND_CENTER_ZONES } from '../mock/commandCenterData';
import { SchematicNetworkMap } from '../components/commandCenter/SchematicNetworkMap';

export const NetworkCommandCenterPage = () => {
  // Region Chained Selectors state
  const [selectedZoneName, setSelectedZoneName] = useState('Northern Railway');
  const [selectedDivisionName, setSelectedDivisionName] = useState('Lucknow');
  const [selectedControlAreaKey, setSelectedControlAreaKey] = useState('Lucknow–Kanpur');

  // Simulation Clock
  const [currentTime, setCurrentTime] = useState(new Date());

  // View Overlays & Layers
  const [activeOverlayView, setActiveOverlayView] = useState('Operational View');
  const [layers, setLayers] = useState({
    stations: true,
    signals: true,
    tracks: true,
    blocks: true,
    trains: true,
    points: true,
    aiOpportunities: true
  });

  // Selected item states for detail drawers
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [selectedSignal, setSelectedSignal] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedAiPlan, setSelectedAiPlan] = useState(null);

  // What-If Simulation State in AI Drawer
  const [whatIfShiftMins, setWhatIfShiftMins] = useState(0);

  // Update Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Zone & Division Chained Lookups
  const zoneObj = COMMAND_CENTER_ZONES[selectedZoneName] || COMMAND_CENTER_ZONES["Northern Railway"];
  const availableDivisions = Object.keys(zoneObj.divisions);
  const divisionObj = zoneObj.divisions[selectedDivisionName] || zoneObj.divisions[availableDivisions[0]];
  const availableControlAreas = Object.keys(divisionObj.controlAreas);
  const areaData = divisionObj.controlAreas[selectedControlAreaKey] || divisionObj.controlAreas[availableControlAreas[0]];

  // Handlers for Zone/Division/Area change
  const handleZoneChange = (zName) => {
    setSelectedZoneName(zName);
    const newZoneObj = COMMAND_CENTER_ZONES[zName];
    const firstDiv = Object.keys(newZoneObj.divisions)[0];
    setSelectedDivisionName(firstDiv);
    const firstArea = Object.keys(newZoneObj.divisions[firstDiv].controlAreas)[0];
    setSelectedControlAreaKey(firstArea);
  };

  const handleDivisionChange = (dName) => {
    setSelectedDivisionName(dName);
    const firstArea = Object.keys(divisionObj.controlAreas)[0];
    setSelectedControlAreaKey(firstArea);
  };

  // Train table columns
  const trainColumns = [
    { title: 'Train No.', dataIndex: 'number', key: 'number', render: t => <strong style={{ color: 'var(--ir-navy)', fontFamily: 'monospace' }}>{t}</strong> },
    { title: 'Train Name', dataIndex: 'name', key: 'name', render: n => <span style={{ fontWeight: 600 }}>{n}</span> },
    { title: 'From', dataIndex: 'from', key: 'from' },
    { title: 'To', dataIndex: 'to', key: 'to' },
    { title: 'Current Block', dataIndex: 'currentBlock', key: 'currentBlock', render: b => <Tag color="geekblue">{b}</Tag> },
    { title: 'Next Station', dataIndex: 'nextStation', key: 'nextStation' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: st => (
        <Tag color={st === 'ON TIME' ? 'success' : st === 'DELAYED' ? 'error' : 'warning'} style={{ fontWeight: 700 }}>
          {st}
        </Tag>
      )
    },
    { title: 'Delay', dataIndex: 'delayMins', key: 'delayMins', render: d => <span style={{ color: d > 0 ? '#dc2626' : '#059669', fontWeight: 700 }}>{d > 0 ? `+${d} min` : 'On Time'}</span> },
    { title: 'Speed', dataIndex: 'speed', key: 'speed', render: s => `${s} km/h` },
    { title: 'Line', dataIndex: 'line', key: 'line', render: l => <Tag color="purple">{l}</Tag> },
    { title: 'ETA Next', dataIndex: 'etaNext', key: 'etaNext' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. TOP HEADER & BRANDING */}
      <div style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        paddingBottom: 12,
        borderBottom: '1px solid var(--ir-border)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)',
              color: '#fff',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: 14,
              letterSpacing: 1
            }}>
              PRAGATI
            </div>
            <span style={{ fontSize: 11, color: 'var(--ir-text-sub)', fontWeight: 600, letterSpacing: 0.5 }}>
              AI-POWERED RAILWAY OPERATIONS
            </span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: '4px 0 0 0', color: 'var(--ir-text-main)', letterSpacing: '0.5px' }}>
            NETWORK COMMAND CENTER
          </h1>
        </div>

        {/* Center: Simulation Indicator & Live Clock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--ir-card-bg)', padding: '6px 14px', borderRadius: 6, border: '1px solid var(--ir-border)' }}>
          <span style={{ color: '#059669', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="pulse-active" style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669', display: 'inline-block' }}></span>
            SIMULATION MODE — Synthetic Railway Data
          </span>
          <span style={{ color: 'var(--ir-border)' }}>|</span>
          <span style={{ color: 'var(--ir-text-main)', fontSize: 12, fontFamily: 'monospace' }}>
            Last updated: {currentTime.toLocaleTimeString()}
          </span>
        </div>

        {/* Right: Chained Zone, Division, Control Area Selectors */}
        <Space wrap size="small">
          <div>
            <div style={{ fontSize: 10, color: 'var(--ir-text-sub)', fontWeight: 700 }}>ZONE</div>
            <Select
              size="small"
              value={selectedZoneName}
              onChange={handleZoneChange}
              style={{ width: 170 }}
              options={Object.keys(COMMAND_CENTER_ZONES).map(z => ({ label: z, value: z }))}
            />
          </div>

          <div>
            <div style={{ fontSize: 10, color: 'var(--ir-text-sub)', fontWeight: 700 }}>DIVISION</div>
            <Select
              size="small"
              value={selectedDivisionName}
              onChange={handleDivisionChange}
              style={{ width: 140 }}
              options={availableDivisions.map(d => ({ label: d, value: d }))}
            />
          </div>

          <div>
            <div style={{ fontSize: 10, color: 'var(--ir-text-sub)', fontWeight: 700 }}>CONTROL AREA</div>
            <Select
              size="small"
              value={selectedControlAreaKey}
              onChange={setSelectedControlAreaKey}
              style={{ width: 170 }}
              options={availableControlAreas.map(c => ({ label: c, value: c }))}
            />
          </div>
        </Space>
      </div>

      {/* 2. OVERLAY VIEW SEGMENTED CONTROLLER & SCOPE ADVISORY */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <Segmented
          value={activeOverlayView}
          onChange={setActiveOverlayView}
          options={[
            'Operational View',
            'AI Opportunity View',
            'Maintenance View',
            'Conflict View'
          ]}
        />

        <Tag color="cyan" icon={<RobotOutlined />}>
          PRAGATI AI Model Active: <strong>{areaData.sectionName}</strong>
        </Tag>
      </div>

      {/* 3. MAIN GRID: SCHEMATIC MAP (LEFT/CENTER) + OPS PANELS (RIGHT) */}
      <Row gutter={[16, 16]}>
        {/* Left/Center: Schematic Network Map */}
        <Col xs={24} lg={17}>
          <SchematicNetworkMap
            areaData={areaData}
            activeOverlayView={activeOverlayView}
            layers={layers}
            setLayers={setLayers}
            onSelectStation={st => setSelectedStation(st)}
            onSelectSignal={sig => setSelectedSignal(sig)}
            onSelectPoint={pt => setSelectedPoint(pt)}
            onSelectBlock={blk => setSelectedBlock(blk)}
            onSelectTrain={trn => setSelectedTrain(trn)}
            onSelectAiOpportunity={opp => setSelectedAiPlan(opp)}
            selectedTrainId={selectedTrain?.id}
          />
        </Col>

        {/* Right Sidebar: Operational Status & AI Opportunity Panels */}
        <Col xs={24} lg={7}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Live Train Summary Panel */}
            <Card
              size="small"
              title={<span style={{ color: 'var(--ir-text-main)', fontWeight: 700, fontSize: 13 }}>LIVE TRAIN SUMMARY</span>}
              style={{ borderRadius: 8, border: '1px solid var(--ir-border)' }}
            >
              <Row gutter={[8, 8]} style={{ textAlign: 'center' }}>
                <Col span={8}>
                  <div style={{ fontSize: 10, color: 'var(--ir-text-sub)' }}>TOTAL</div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>38</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontSize: 10, color: 'var(--ir-text-sub)' }}>RUNNING</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#0284c7' }}>31</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontSize: 10, color: 'var(--ir-text-sub)' }}>ON TIME</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#059669' }}>21</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontSize: 10, color: 'var(--ir-text-sub)' }}>DELAYED</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#dc2626' }}>8</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontSize: 10, color: 'var(--ir-text-sub)' }}>STOPPED</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#d97706' }}>2</div>
                </Col>
                <Col span={8}>
                  <div style={{ fontSize: 10, color: 'var(--ir-text-sub)' }}>HELD</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#7c3aed' }}>1</div>
                </Col>
              </Row>
            </Card>

            {/* Network Status Panel */}
            <Card
              size="small"
              title={<span style={{ color: 'var(--ir-text-main)', fontWeight: 700, fontSize: 13 }}>NETWORK STATUS</span>}
              style={{ borderRadius: 8, border: '1px solid var(--ir-border)' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--ir-text-sub)' }}>Stations:</span>
                  <strong>{areaData.stations.length}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--ir-text-sub)' }}>Active Signals:</span>
                  <strong style={{ color: '#059669' }}>{areaData.signals.length} (Clear: {areaData.signals.filter(s => s.aspect==='CLEAR').length})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--ir-text-sub)' }}>Blocks Active / Free:</span>
                  <strong style={{ color: '#0284c7' }}>{areaData.blocks.length} Active ({areaData.blocks.filter(b => b.status==='CLEAR').length} Available)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--ir-text-sub)' }}>Asset Alerts:</span>
                  <strong style={{ color: '#dc2626' }}>{areaData.alerts.length} Active</strong>
                </div>
              </div>
            </Card>

            {/* PRAGATI AI Operational Opportunities Panel */}
            <Card
              size="small"
              title={
                <span style={{ color: '#059669', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <RobotOutlined /> PRAGATI AI OPPORTUNITIES
                </span>
              }
              style={{ background: 'rgba(5, 150, 105, 0.04)', border: '1px solid #059669', borderRadius: 8 }}
            >
              {areaData.aiOpportunities.map(opp => (
                <div key={opp.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Tag color="success" style={{ fontWeight: 700 }}>{opp.sectionCode}</Tag>
                    <span style={{ fontSize: 11, color: '#059669', fontWeight: 700 }}>{opp.confidence}% Confidence</span>
                  </div>

                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ir-text-main)' }}>
                    Window: {opp.opportunityWindow} ({opp.durationMins} min)
                  </div>

                  <div style={{ fontSize: 11, color: 'var(--ir-text-sub)' }}>
                    {opp.reasoning}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, background: 'var(--ir-bg)', padding: '4px 8px', borderRadius: 4 }}>
                    <span>Asset Gain: <strong style={{ color: '#059669' }}>{opp.assetAvailabilityGain}</strong></span>
                    <span>Risk: <strong style={{ color: '#0284c7' }}>{opp.riskTier}</strong></span>
                  </div>

                  <Button
                    type="primary"
                    size="small"
                    icon={<EyeOutlined />}
                    style={{ background: '#059669', borderColor: '#059669', marginTop: 4 }}
                    onClick={() => setSelectedAiPlan(opp)}
                  >
                    VIEW PLAN & SIMULATE
                  </Button>
                </div>
              ))}
            </Card>

            {/* Section Information Panel */}
            <Card
              size="small"
              title={<span style={{ color: 'var(--ir-text-sub)', fontWeight: 700, fontSize: 12 }}>SECTION INFORMATION</span>}
              style={{ borderRadius: 8, border: '1px solid var(--ir-border)' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, color: 'var(--ir-text-sub)' }}>
                <div>Length: <strong>{areaData.lengthKm} km</strong></div>
                <div>Line: <strong>{areaData.lineType}</strong></div>
                <div>Block System: <strong>{areaData.blockSystem}</strong></div>
                <div>Traffic Density: <strong style={{ color: '#d97706' }}>{areaData.trafficDensity}</strong></div>
                <div>Maintenance Debt: <strong style={{ color: '#dc2626' }}>{areaData.maintenanceDebtHours} hrs</strong></div>
              </div>
            </Card>
          </div>
        </Col>
      </Row>

      {/* 4. BOTTOM OPERATIONAL TRAIN TABLE */}
      <Card
        size="small"
        title={<span style={{ color: 'var(--ir-text-main)', fontWeight: 700, fontSize: 13 }}>LIVE OPERATIONAL TRAIN MOVEMENT TABLE</span>}
        style={{ borderRadius: 8, border: '1px solid var(--ir-border)' }}
      >
        <Table
          size="small"
          columns={trainColumns}
          dataSource={areaData.trains}
          rowKey="id"
          pagination={false}
          onRow={(record) => ({
            onClick: () => setSelectedTrain(record),
            style: { cursor: 'pointer' }
          })}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* 5. PRAGATI AI RECOMMENDATION & WHAT-IF SIMULATION DRAWER */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#059669' }}>
            <RobotOutlined />
            <span>PRAGATI AI PLAN RECOMMENDATION: {selectedAiPlan?.sectionCode}</span>
          </div>
        }
        placement="right"
        width={580}
        onClose={() => setSelectedAiPlan(null)}
        open={!!selectedAiPlan}
      >
        {selectedAiPlan && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Alert
              type="info"
              showIcon
              message="PRAGATI DECISION-SUPPORT ADVISORY"
              description="This recommendation provides AI predictive simulation to maximize asset availability. It does NOT overwrite live railway signalling interlocking."
            />

            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Target Section" span={2}>{selectedAiPlan.sectionCode}</Descriptions.Item>
              <Descriptions.Item label="Recommended Window">{selectedAiPlan.opportunityWindow}</Descriptions.Item>
              <Descriptions.Item label="Block Duration">{selectedAiPlan.durationMins} Mins</Descriptions.Item>
              <Descriptions.Item label="AI Confidence">{selectedAiPlan.confidence}%</Descriptions.Item>
              <Descriptions.Item label="Risk Rating"><Tag color="success">{selectedAiPlan.riskTier}</Tag></Descriptions.Item>
              <Descriptions.Item label="Required Crew">{selectedAiPlan.requiredCrew} Trackmen</Descriptions.Item>
              <Descriptions.Item label="Required Machine">{selectedAiPlan.requiredMachine}</Descriptions.Item>
            </Descriptions>

            <Divider style={{ margin: '8px 0' }} />

            <div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
                BEFORE VS AFTER OPERATIONAL IMPACT COMPARISON
              </div>

              <Row gutter={12}>
                <Col span={12}>
                  <div style={{ padding: 12, background: 'rgba(220, 38, 38, 0.05)', borderRadius: 8, border: '1px solid #dc2626' }}>
                    <div style={{ fontSize: 11, color: '#dc2626', fontWeight: 700 }}>BEFORE (Deferred Maintenance)</div>
                    <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>
                      {selectedAiPlan.beforeState.predictedFutureDelay} Delay
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--ir-text-sub)', marginTop: 4 }}>
                      Asset Availability: {selectedAiPlan.beforeState.assetAvailability}
                    </div>
                  </div>
                </Col>

                <Col span={12}>
                  <div style={{ padding: 12, background: 'rgba(5, 150, 105, 0.05)', borderRadius: 8, border: '1px solid #059669' }}>
                    <div style={{ fontSize: 11, color: '#059669', fontWeight: 700 }}>AFTER (AI Window Execution)</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#059669', marginTop: 4 }}>
                      {selectedAiPlan.afterState.predictedFutureDelay} Delay
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--ir-text-sub)', marginTop: 4 }}>
                      Asset Availability: {selectedAiPlan.afterState.assetAvailability} ({selectedAiPlan.assetAvailabilityGain})
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            <div style={{ background: 'var(--ir-bg)', padding: 16, borderRadius: 8, border: '1px solid var(--ir-border)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0284c7', marginBottom: 8 }}>
                WHAT-IF SCHEDULE SIMULATOR ("Move block by +5 min")
              </div>
              <Space>
                <Button size="small" onClick={() => setWhatIfShiftMins(prev => prev + 5)}>+5 Min Shift</Button>
                <Button size="small" onClick={() => setWhatIfShiftMins(prev => prev - 5)}>-5 Min Shift</Button>
                <Button size="small" onClick={() => setWhatIfShiftMins(0)}>Reset</Button>
              </Space>

              {whatIfShiftMins !== 0 && (
                <div style={{ marginTop: 12, fontSize: 11, color: '#059669', fontWeight: 600 }}>
                  Simulated {whatIfShiftMins > 0 ? `+${whatIfShiftMins}` : whatIfShiftMins} min shift: Maintained 100% safety headway. Next train delay remains 0 min.
                </div>
              )}
            </div>

            <Button block type="primary" style={{ background: '#059669', borderColor: '#059669' }} onClick={() => setSelectedAiPlan(null)}>
              APPROVE AI BLOCK PLAN FOR COA DISPATCH
            </Button>
          </div>
        )}
      </Drawer>

      {/* TRAIN ROUTE INSPECTION DRAWER */}
      <Drawer
        title={`Train Telemetry: ${selectedTrain?.number} (${selectedTrain?.name})`}
        placement="right"
        width={420}
        onClose={() => setSelectedTrain(null)}
        open={!!selectedTrain}
      >
        {selectedTrain && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Train Number">{selectedTrain.number}</Descriptions.Item>
            <Descriptions.Item label="Train Name">{selectedTrain.name}</Descriptions.Item>
            <Descriptions.Item label="Type">{selectedTrain.type}</Descriptions.Item>
            <Descriptions.Item label="Speed">{selectedTrain.speed} km/h</Descriptions.Item>
            <Descriptions.Item label="Delay">{selectedTrain.delayMins > 0 ? `+${selectedTrain.delayMins} min` : 'On Time'}</Descriptions.Item>
            <Descriptions.Item label="Current Block">{selectedTrain.currentBlock}</Descriptions.Item>
            <Descriptions.Item label="Next Station">{selectedTrain.nextStation}</Descriptions.Item>
            <Descriptions.Item label="ETA">{selectedTrain.etaNext}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
};

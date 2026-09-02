import React, { useState, useRef, useEffect } from 'react';
import { Card, Row, Col, Select, Checkbox, Tag, Button, Alert, Spin, Drawer, Descriptions, Divider, Space } from 'antd';
import {
  DesktopOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  EyeOutlined,
  AimOutlined,
  InfoCircleOutlined,
  ThunderboltOutlined,
  ToolOutlined,
  BlockOutlined,
  PlusOutlined,
  SendOutlined
} from '@ant-design/icons';
import { DIVISIONS } from '../mock/apiData';
import { useAuth } from '../context/AuthContext';
import { AddDefectModal } from '../components/common/AddDefectModal';
import { SendBlockRequestModal } from '../components/common/SendBlockRequestModal';

export const DigitalTwinPage = () => {
  const containerRef = useRef(null);
  const { currentUser } = useAuth();
  const [unityConnected, setUnityConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState('DLI');
  const [activeLayers, setActiveLayers] = useState(['track', 'signal', 'ohe', 'trains']);
  
  // Contextual Action Modal States
  const [addDefectOpen, setAddDefectOpen] = useState(false);
  const [sendBlockOpen, setSendBlockOpen] = useState(false);

  const [selectedNode, setSelectedNode] = useState({
    id: 'TRK-NDLS-142',
    name: 'NDLS-CNB Down Track Segment KM 142/10-16',
    department: currentUser?.department || 'TMS',
    status: 'Maintenance Due',
    activeBlock: 'JB-NDLS-CNB-01',
    currentDefects: 2,
    lastScanDate: '2026-09-02 18:00',
    geoCoordinates: '28.6139° N, 77.2090° E',
    activeSpeedRestriction: '30 km/h'
  });
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Message passing stub for Unity WebGL integration
  useEffect(() => {
    window.UnityBridge = {
      onNodeSelected: (nodeData) => {
        console.log('[Unity Bridge] Node selected from 3D viewport:', nodeData);
        setSelectedNode(nodeData);
        setDrawerVisible(true);
      },
      sendMessageToUnity: (gameObjectName, methodName, param) => {
        console.log(`[Unity Bridge] Sent message to Unity -> Object: ${gameObjectName}, Method: ${methodName}, Param:`, param);
      }
    };

    return () => {
      delete window.UnityBridge;
    };
  }, []);

  const handleSimulateMount = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUnityConnected(true);
    }, 1200);
  };

  const handleLayerToggle = (layer) => {
    const updated = activeLayers.includes(layer)
      ? activeLayers.filter(l => l !== layer)
      : [...activeLayers, layer];
    setActiveLayers(updated);

    if (window.UnityBridge) {
      window.UnityBridge.sendMessageToUnity('LayerManager', 'ToggleLayerVisibility', JSON.stringify(updated));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <DesktopOutlined style={{ color: '#0284c7' }} /> Digital Twin 3D Infrastructure Viewport
          </h1>
          <p style={{ color: 'var(--ir-text-sub)', margin: 0, fontSize: 13 }}>
            High-precision 3D spatial visualization of corridor assets, ongoing joint blocks, and train movements ({currentUser?.department || 'ALL'} View)
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <Tag color={unityConnected ? "success" : "warning"} style={{ padding: '6px 12px', fontSize: 12, fontWeight: 600 }}>
            WebGL Status: {unityConnected ? "Connected (Live Mesh)" : "Standby (Mount Stub Ready)"}
          </Tag>
          {!unityConnected && (
            <Button type="primary" icon={<PlayCircleOutlined />} onClick={handleSimulateMount} loading={loading}>
              Simulate Unity Mount
            </Button>
          )}
        </div>
      </div>

      {/* Main 3D Viewport Container & Control Panel */}
      <Row gutter={[20, 20]}>
        {/* Left 3D Canvas Window */}
        <Col xs={24} lg={18}>
          <Card
            bodyStyle={{ padding: 0, position: 'relative' }}
            style={{ borderRadius: 10, border: '1px solid var(--ir-border)', overflow: 'hidden' }}
          >
            <div
              ref={containerRef}
              id="unity-canvas-container"
              className="digital-twin-grid"
              style={{
                height: 520,
                width: '100%',
                background: '#090d16',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}
            >
              {loading ? (
                <div style={{ textAlign: 'center' }}>
                  <Spin size="large" />
                  <div style={{ marginTop: 16, color: '#38bdf8', fontWeight: 600 }}>
                    Initializing Unity WebGL Engine & Loading Terrain Mesh...
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                    Ingesting geospatial data for {selectedDivision} Division
                  </div>
                </div>
              ) : unityConnected ? (
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <div style={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    border: '2px dashed #0284c7',
                    margin: '0 auto 16px auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(2, 132, 199, 0.1)',
                    boxShadow: '0 0 30px rgba(2, 132, 199, 0.3)'
                  }}>
                    <AimOutlined style={{ fontSize: 48, color: '#38bdf8' }} />
                  </div>
                  <Tag color="cyan" style={{ fontSize: 13, padding: '4px 12px' }}>
                    Unity WebGL Instance Mounted & Active
                  </Tag>
                  <div style={{ marginTop: 12, fontSize: 13, color: '#cbd5e1' }}>
                    Spatial mesh rendered for {selectedDivision} Corridor • 3D Inspector active
                  </div>
                  <Button 
                    type="primary" 
                    size="small" 
                    icon={<InfoCircleOutlined />} 
                    style={{ marginTop: 12 }}
                    onClick={() => setDrawerVisible(true)}
                  >
                    Inspect Selected Asset Node ({selectedNode.id})
                  </Button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', maxWidth: 480, padding: 24 }}>
                  <DesktopOutlined style={{ fontSize: 56, color: '#475569', marginBottom: 16 }} />
                  <h3 style={{ color: '#f8fafc', margin: '0 0 8px 0' }}>Unity WebGL Container Ready</h3>
                  <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>
                    This container is configured to receive the compiled Unity WebGL build (<code style={{ color: '#38bdf8' }}>Build/Build.json</code>).
                    Message-passing bridge functions (<code style={{ color: '#38bdf8' }}>window.UnityBridge</code>) are stubbed and ready.
                  </p>
                  <Button type="dashed" ghost onClick={handleSimulateMount} style={{ color: '#38bdf8', borderColor: '#38bdf8' }}>
                    Test WebGL Bridge Connection
                  </Button>
                </div>
              )}

              {/* HUD Overlay Stats inside Canvas */}
              <div style={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(8px)',
                padding: '8px 16px',
                borderRadius: 6,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                gap: 16,
                fontSize: 11,
                color: '#cbd5e1'
              }}>
                <div>FPS: <strong style={{ color: '#4ade80' }}>60.0</strong></div>
                <div>Camera: <strong>Orbit 360°</strong></div>
                <div>Geospatial Datum: <strong>WGS-84 / IR GIS</strong></div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Right Control & Layer Panel */}
        <Col xs={24} lg={6}>
          <Card title="Digital Twin Controls" style={{ borderRadius: 10, border: '1px solid var(--ir-border)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ir-text-sub)' }}>
                  Division Sub-Model:
                </label>
                <Select
                  value={selectedDivision}
                  onChange={setSelectedDivision}
                  style={{ width: '100%', marginTop: 4 }}
                  options={DIVISIONS.map(d => ({ label: `${d.code} - ${d.name}`, value: d.code }))}
                />
              </div>

              <Divider style={{ margin: '8px 0' }} />

              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ir-text-sub)', marginBottom: 8 }}>
                  Active Asset Layers:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Checkbox 
                    checked={activeLayers.includes('track')}
                    onChange={() => handleLayerToggle('track')}
                  >
                    <ToolOutlined style={{ color: '#3b82f6', marginRight: 6 }} /> Engineering Track Geometry
                  </Checkbox>
                  <Checkbox 
                    checked={activeLayers.includes('signal')}
                    onChange={() => handleLayerToggle('signal')}
                  >
                    <ThunderboltOutlined style={{ color: '#f59e0b', marginRight: 6 }} /> Signal & Interlocking
                  </Checkbox>
                  <Checkbox 
                    checked={activeLayers.includes('ohe')}
                    onChange={() => handleLayerToggle('ohe')}
                  >
                    <BlockOutlined style={{ color: '#8b5cf6', marginRight: 6 }} /> Traction OHE Infrastructure
                  </Checkbox>
                  <Checkbox 
                    checked={activeLayers.includes('trains')}
                    onChange={() => handleLayerToggle('trains')}
                  >
                    <EyeOutlined style={{ color: '#10b981', marginRight: 6 }} /> Live Train Positions
                  </Checkbox>
                </div>
              </div>

              <Divider style={{ margin: '8px 0' }} />

              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ir-text-sub)', marginBottom: 8 }}>
                  Viewport Legend:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 12, height: 12, borderRadius: 2, background: '#059669', display: 'inline-block' }}></span>
                    <span>Joint Merged Maintenance Block</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 12, height: 12, borderRadius: 2, background: '#dc2626', display: 'inline-block' }}></span>
                    <span>S1 Critical Defect Location</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 12, height: 12, borderRadius: 2, background: '#0284c7', display: 'inline-block' }}></span>
                    <span>Passenger Express Train Unit</span>
                  </div>
                </div>
              </div>

              <Button block icon={<ReloadOutlined />} onClick={handleSimulateMount}>
                Reset Viewport
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Selected Node Telemetry Drawer with Contextual Action Workflows */}
      <Drawer
        title={`Asset Telemetry Inspector: ${selectedNode.id}`}
        placement="right"
        width={440}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        <Descriptions column={1} bordered size="small" style={{ marginBottom: 20 }}>
          <Descriptions.Item label="Asset Name">{selectedNode.name}</Descriptions.Item>
          <Descriptions.Item label="Department">{selectedNode.department}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color="warning">{selectedNode.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Active Joint Block">{selectedNode.activeBlock}</Descriptions.Item>
          <Descriptions.Item label="Coordinates">{selectedNode.geoCoordinates}</Descriptions.Item>
          <Descriptions.Item label="Speed Restriction">{selectedNode.activeSpeedRestriction}</Descriptions.Item>
          <Descriptions.Item label="Last LiDAR Scan">{selectedNode.lastScanDate}</Descriptions.Item>
        </Descriptions>

        {/* CONTEXTUAL ACTION WORKFLOW BUTTONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Button
            type="primary"
            block
            icon={<PlusOutlined />}
            style={{ background: '#0284c7', borderColor: '#0284c7' }}
            onClick={() => setAddDefectOpen(true)}
          >
            LOG NEW DEFECT FOR THIS ASSET
          </Button>

          <Button
            type="primary"
            block
            icon={<SendOutlined />}
            style={{ background: '#059669', borderColor: '#059669' }}
            onClick={() => setSendBlockOpen(true)}
          >
            SEND BLOCK REQUEST FOR THIS ASSET
          </Button>
        </div>
      </Drawer>

      {/* Contextual Action Modals */}
      <AddDefectModal
        open={addDefectOpen}
        onClose={() => setAddDefectOpen(false)}
        defaultAsset={selectedNode}
      />

      <SendBlockRequestModal
        open={sendBlockOpen}
        onClose={() => setSendBlockOpen(false)}
        targetItem={selectedNode}
      />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Button, Switch, Tag, Badge, Tooltip } from 'antd';
import {
  LineChartOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  NotificationOutlined,
  CloudOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { STATION_BOARDS } from '../mock/apiData';

export const StationDisplayBoardPage = () => {
  const [selectedStation, setSelectedStation] = useState('NDLS');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live Clock & 30-sec Auto Refresh
  useEffect(() => {
    const clockTimer = setInterval(() => setCurrentTime(new Date()), 1000);

    let refreshTimer;
    if (autoRefresh) {
      refreshTimer = setInterval(() => {
        setIsRefreshing(true);
        setLastRefreshed(new Date());
        setTimeout(() => setIsRefreshing(false), 800);
      }, 30000);
    }

    return () => {
      clearInterval(clockTimer);
      if (refreshTimer) clearInterval(refreshTimer);
    };
  }, [autoRefresh]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setLastRefreshed(new Date());
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const stationData = STATION_BOARDS[selectedStation] || STATION_BOARDS.NDLS;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <LineChartOutlined style={{ color: '#d97706' }} /> Station Passenger Information Display System (PIDS)
          </h1>
          <p style={{ color: 'var(--ir-text-sub)', margin: 0, fontSize: 13 }}>
            Live platform matrix display feed with automatic block schedule delay integration
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 500 }}>Select Station:</span>
            <Select
              value={selectedStation}
              onChange={setSelectedStation}
              style={{ width: 220 }}
              options={[
                { value: 'NDLS', label: 'NDLS - New Delhi' },
                { value: 'HWH', label: 'HWH - Howrah Junction' },
                { value: 'CSMT', label: 'CSMT - Mumbai CST' },
              ]}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 500 }}>30s Auto Refresh:</span>
            <Switch checked={autoRefresh} onChange={setAutoRefresh} size="small" />
          </div>

          <Button icon={<ReloadOutlined spin={isRefreshing} />} onClick={handleManualRefresh}>
            Refresh Feed
          </Button>
        </div>
      </div>

      {/* Indian Railways Authentic LED Display Frame */}
      <div className="led-container-bg" style={{ borderRadius: 12, padding: 24 }}>
        {/* LED Top Header Bar */}
        <div style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          borderBottom: '2px dashed #333',
          paddingBottom: 16,
          marginBottom: 20
        }}>
          <div>
            <div className="led-board-font led-amber-text" style={{ fontSize: 26, fontWeight: 800 }}>
              INDIAN RAILWAYS • {stationData.stationName} ({stationData.stationCode})
            </div>
            <div className="led-board-font" style={{ color: '#888', fontSize: 13, marginTop: 2 }}>
              DIVISION: {stationData.division} • JOINTBLOCK AI REAL-TIME FEED
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div className="led-board-font led-amber-text" style={{ fontSize: 28, fontWeight: 800 }}>
              {currentTime.toLocaleTimeString('en-IN', { hour12: false })}
            </div>
            <div className="led-board-font" style={{ color: '#888', fontSize: 12 }}>
              {currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Scrolling LED Announcement Bar */}
        <div style={{
          background: '#000',
          border: '1px solid #333',
          padding: '8px 16px',
          borderRadius: 6,
          marginBottom: 24,
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        }}>
          <span className="led-board-font led-amber-text marquee-scroll" style={{ fontSize: 14 }}>
            *** ATTENTION PASSENGERS: JOINT TRACK MAINTENANCE BLOCK IS CURRENTLY ACTIVE ON NDLS-CNB DOWN LINE. TRAIN 12004 KALKA SHATABDI REROUTED VIA LOOP WITH 12 MINS CONTROLLED RUN. REGRET INCONVENIENCE. ***
          </span>
        </div>

        {/* LED Arrivals and Departures Boards */}
        <Row gutter={[24, 24]}>
          {/* Arrivals Board */}
          <Col xs={24} lg={12}>
            <div style={{ border: '1px solid #222', borderRadius: 8, padding: 16, background: '#050505' }}>
              <div className="led-board-font led-amber-text" style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, borderBottom: '1px solid #333', paddingBottom: 8 }}>
                ARRIVALS / आगमन
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {stationData.arrivals.map((train, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: '#0f0f0f',
                    borderRadius: 4,
                    borderLeft: '4px solid #ffb700'
                  }}>
                    <div>
                      <span className="led-board-font led-amber-text" style={{ fontSize: 16, fontWeight: 700, marginRight: 12 }}>
                        {train.trainNo}
                      </span>
                      <span className="led-board-font" style={{ color: '#fff', fontSize: 14 }}>
                        {train.name}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span className="led-board-font led-amber-text" style={{ fontSize: 14 }}>
                        {train.expTime}
                      </span>
                      <span className={`led-board-font ${train.status.includes('DELAYED') ? 'led-red-text' : 'led-green-text'}`} style={{ fontSize: 13, fontWeight: 700 }}>
                        {train.status}
                      </span>
                      <span className="led-board-font" style={{ color: '#38bdf8', fontSize: 14, fontWeight: 700, minWidth: 50, textAlign: 'right' }}>
                        {train.platform}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>

          {/* Departures Board */}
          <Col xs={24} lg={12}>
            <div style={{ border: '1px solid #222', borderRadius: 8, padding: 16, background: '#050505' }}>
              <div className="led-board-font led-amber-text" style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, borderBottom: '1px solid #333', paddingBottom: 8 }}>
                DEPARTURES / प्रस्थान
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {stationData.departures.map((train, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: '#0f0f0f',
                    borderRadius: 4,
                    borderLeft: '4px solid #00ff66'
                  }}>
                    <div>
                      <span className="led-board-font led-amber-text" style={{ fontSize: 16, fontWeight: 700, marginRight: 12 }}>
                        {train.trainNo}
                      </span>
                      <span className="led-board-font" style={{ color: '#fff', fontSize: 14 }}>
                        {train.name}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span className="led-board-font led-amber-text" style={{ fontSize: 14 }}>
                        {train.expTime}
                      </span>
                      <span className={`led-board-font ${train.status === 'BOARDING' ? 'led-amber-text' : 'led-green-text'}`} style={{ fontSize: 13, fontWeight: 700 }}>
                        {train.status}
                      </span>
                      <span className="led-board-font" style={{ color: '#38bdf8', fontSize: 14, fontWeight: 700, minWidth: 50, textAlign: 'right' }}>
                        {train.platform}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Auxiliary Info Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card size="small" title={<><CloudOutlined /> Station Weather & Visibility</>} style={{ borderRadius: 8 }}>
            <div style={{ fontSize: 13 }}>
              <div>Condition: <strong>Clear / Light Smog</strong></div>
              <div>Temperature: <strong>29°C</strong></div>
              <div>Signal Visibility Index: <strong>Optimal (98%)</strong></div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card size="small" title={<><NotificationOutlined /> Active Block Traffic Advisory</>} style={{ borderRadius: 8 }}>
            <div style={{ fontSize: 13 }}>
              <div>Active Corridor: <strong>NDLS-CNB Down Line</strong></div>
              <div>Block Window: <strong>02:00 - 06:00 (Night)</strong></div>
              <div>Speed Restrictions: <strong>30 km/h at KM 142</strong></div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card size="small" title={<><CheckCircleOutlined /> PIDS Feed Status</>} style={{ borderRadius: 8 }}>
            <div style={{ fontSize: 13 }}>
              <div>COA Backend Feed: <Tag color="success">Connected</Tag></div>
              <div>Last Synced: <strong>{lastRefreshed.toLocaleTimeString()}</strong></div>
              <div>PIDS Display ID: <strong>NDLS-PIDS-MAIN-01</strong></div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

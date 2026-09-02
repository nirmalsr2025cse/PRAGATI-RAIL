import React, { useState } from 'react';
import { Layout, Menu, Button, Select, Badge, Dropdown, Avatar, Tag, Tooltip, Switch, Space } from 'antd';
import {
  DashboardOutlined,
  RobotOutlined,
  BlockOutlined,
  DesktopOutlined,
  ToolOutlined,
  AlertOutlined,
  FileTextOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  LineChartOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SunOutlined,
  MoonOutlined,
  UserOutlined,
  BellOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined,
  AimOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRegion } from '../../context/RegionContext';

const { Header, Sider, Content } = Layout;

export const AppShell = ({ children, isDarkMode, setIsDarkMode, userRole, setUserRole }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    selectedZone,
    setSelectedZone,
    selectedDivision,
    setSelectedDivision,
    ZONES,
    availableDivisions
  } = useRegion();

  const menuItems = [
    { 
      key: '/command-center', 
      icon: <AimOutlined style={{ color: '#38bdf8', fontSize: 18 }} />, 
      label: (
        <span style={{ fontWeight: 800, color: '#38bdf8' }}>
          1. Command Center ★
        </span>
      ) 
    },
    { key: '/overview', icon: <DashboardOutlined />, label: '2. Overview Dashboard' },
    { key: '/ai-responses', icon: <RobotOutlined />, label: '3. AI Optimization Results' },
    { key: '/digital-twin', icon: <DesktopOutlined />, label: '4. Digital Twin 3D' },
    { key: '/station-board', icon: <LineChartOutlined />, label: '5. Station Display Board' },
    { key: '/tms', icon: <ToolOutlined />, label: '6. TMS Track Maintenance' },
    { key: '/smms', icon: <ThunderboltOutlined />, label: '7. SMMS Signal & Telecom' },
    { key: '/tdms', icon: <BlockOutlined />, label: '8. TDMS Traction (OHE)' },
    { 
      key: '/bdms-planner', 
      icon: <BlockOutlined style={{ color: '#059669', fontSize: 18 }} />, 
      label: (
        <span style={{ fontWeight: 700, color: '#059669' }}>
          9. BDMS Block Planner ★
        </span>
      ) 
    },
    { key: '/coa-database', icon: <LineChartOutlined />, label: '10. COA Corridor DB' },
    { 
      key: '/alerts', 
      icon: <Badge count={1} dot><AlertOutlined /></Badge>, 
      label: '11. Alert System' 
    },
    { key: '/reports', icon: <FileTextOutlined />, label: '12. Reports & Analytics' },
    { key: '/settings', icon: <SettingOutlined />, label: '13. Settings & Users' },
  ];

  const roleColors = {
    Admin: 'red',
    Manager: 'blue',
    Viewer: 'orange'
  };

  const getScopeBadge = () => {
    if (selectedZone === 'ALL') {
      return <Tag color="gold" icon={<GlobalOutlined />}>National Scope: All India (18 Zones)</Tag>;
    }
    if (selectedDivision === 'ALL') {
      return <Tag color="geekblue" icon={<SafetyCertificateOutlined />}>Zonal Scope: {selectedZone}</Tag>;
    }
    return <Tag color="green">Divisional Scope: {selectedDivision} ({selectedZone})</Tag>;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar Navigation */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={250}
        style={{
          background: isDarkMode ? '#131b2e' : '#ffffff',
          borderRight: '1px solid var(--ir-border)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 100
        }}
      >
        {/* Brand Crest & Title */}
        <div style={{
          height: 64,
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderBottom: '1px solid var(--ir-border)'
        }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: 15,
            boxShadow: '0 2px 8px rgba(30, 58, 138, 0.4)'
          }}>
            PR
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, lineHeight: 1.2, color: 'var(--ir-text-main)', letterSpacing: '0.5px' }}>
                PRAGATI-RAIL
              </div>
              <div style={{ fontSize: 10, color: 'var(--ir-text-sub)', fontWeight: 500 }}>
                Indian Railways
              </div>
            </div>
          )}
        </div>

        {/* Chained Region Controls: Zone & Division Selectors */}
        {!collapsed && (
          <div style={{ padding: '12px 16px 8px 16px', borderBottom: '1px solid var(--ir-border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              <div style={{ fontSize: 10, color: 'var(--ir-text-sub)', marginBottom: 2, fontWeight: 700, textTransform: 'uppercase' }}>
                1. Select Zone
              </div>
              <Select
                value={selectedZone}
                onChange={setSelectedZone}
                style={{ width: '100%' }}
                options={ZONES.map(z => ({ label: z.name, value: z.code }))}
              />
            </div>

            <div>
              <div style={{ fontSize: 10, color: 'var(--ir-text-sub)', marginBottom: 2, fontWeight: 700, textTransform: 'uppercase' }}>
                2. Select Division
              </div>
              <Select
                value={selectedDivision}
                onChange={setSelectedDivision}
                style={{ width: '100%' }}
                options={availableDivisions.map(d => ({ label: d.name, value: d.code }))}
              />
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0, marginTop: 4 }}
        />
      </Sider>

      <Layout>
        {/* Header Bar */}
        <Header style={{
          padding: '0 24px',
          background: isDarkMode ? '#131b2e' : '#ffffff',
          borderBottom: '1px solid var(--ir-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 99
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 16 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {getScopeBadge()}
              <Tag color="green">RAILWISE AI Engine: Online</Tag>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Quick Role Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--ir-bg)', padding: '4px 10px', borderRadius: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 500 }}>Role Preview:</span>
              <Select
                size="small"
                value={userRole}
                onChange={setUserRole}
                style={{ width: 100 }}
                options={[
                  { value: 'Admin', label: 'Admin' },
                  { value: 'Manager', label: 'Manager' },
                  { value: 'Viewer', label: 'Viewer (RO)' },
                ]}
              />
              <Tag color={roleColors[userRole]}>{userRole}</Tag>
            </div>

            {/* Quick Alerts Bell */}
            <Tooltip title="Emergency Alerts (1 Pending)">
              <Button 
                type="text" 
                icon={
                  <Badge count={1} offset={[-2, 2]}>
                    <BellOutlined style={{ fontSize: 18, color: '#dc2626' }} />
                  </Badge>
                }
                onClick={() => navigate('/alerts')}
              />
            </Tooltip>

            {/* Theme Toggle */}
            <Tooltip title={isDarkMode ? 'Switch to Light Theme (Default)' : 'Switch to Dark Theme'}>
              <Switch
                checked={isDarkMode}
                onChange={setIsDarkMode}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
              />
            </Tooltip>

            {/* User Profile Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 8, borderLeft: '1px solid var(--ir-border)' }}>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1e3a8a' }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.1 }}>RAILWISE Controller</div>
                <div style={{ fontSize: 10, color: 'var(--ir-text-sub)' }}>
                  {selectedZone === 'ALL' ? 'Railway Board (All India)' : `${selectedZone} Zone Desk`}
                </div>
              </div>
            </div>
          </div>
        </Header>

        {/* Viewport Content */}
        <Content style={{ margin: '20px', minHeight: 280 }}>
          {userRole === 'Viewer' && (
            <div style={{
              background: '#fffbe6',
              border: '1px solid #ffe58f',
              padding: '8px 16px',
              borderRadius: 8,
              marginBottom: 16,
              fontSize: 13,
              color: '#d46b08',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span><strong>VIEWER MODE ACTIVE:</strong> You have read-only access to schedules and logs. Action controls are disabled.</span>
              <Button size="small" onClick={() => setUserRole('Admin')}>Switch to Admin</Button>
            </div>
          )}
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

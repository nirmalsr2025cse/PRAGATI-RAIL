import React, { useState } from 'react';
import { Layout, Menu, Button, Select, Badge, Avatar, Tag, Tooltip, Switch, Space } from 'antd';
import {
  RobotOutlined,
  BlockOutlined,
  DesktopOutlined,
  ToolOutlined,
  AlertOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  DatabaseOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SunOutlined,
  MoonOutlined,
  UserOutlined,
  BellOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined,
  LogoutOutlined,
  CalendarOutlined,
  SettingOutlined,
  CompassOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRegion } from '../../context/RegionContext';
import { useAuth } from '../../context/AuthContext';

const { Header, Sider, Content } = Layout;

export const AppShell = ({ children, isDarkMode, setIsDarkMode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout, hasPermission } = useAuth();
  const {
    selectedZone,
    setSelectedZone,
    selectedDivision,
    setSelectedDivision,
    ZONES,
    availableDivisions
  } = useRegion();

  // Master base menu list (Un-numbered; items will be filtered and indexed dynamically from 1 to N)
  const masterMenuItems = [
    { key: '/command-center', icon: <CompassOutlined />, rawLabel: 'Network Command Center' },
    { key: '/overview', icon: <DashboardOutlined />, rawLabel: 'Executive Overview Dashboard' },
    { key: '/ai-responses', icon: <RobotOutlined />, rawLabel: 'AI Optimization Results' },
    { key: '/digital-twin', icon: <DesktopOutlined />, rawLabel: 'Digital Twin' },
    { key: '/tms', icon: <ToolOutlined />, rawLabel: 'TMS Track Maintenance' },
    { key: '/smms', icon: <ThunderboltOutlined />, rawLabel: 'SMMS Signal & Telecom' },
    { key: '/tdms', icon: <BlockOutlined />, rawLabel: 'TDMS Traction (OHE)' },
    { key: '/bdms-planner', icon: <CalendarOutlined />, rawLabel: 'BDMS Block Planner' },
    { key: '/coa-database', icon: <DatabaseOutlined />, rawLabel: 'COA Corridor DB' },
    { key: '/alerts', icon: <Badge count={1} dot><AlertOutlined /></Badge>, rawLabel: 'Alert System' },
    { key: '/reports', icon: <FileTextOutlined />, rawLabel: 'Reports & Analytics' },
    { key: '/settings', icon: <SettingOutlined />, rawLabel: 'Settings & Users' },
  ];

  // Filter allowed menu items by user role permissions and dynamically generate 1-to-N sequential numbering
  const allowedMenuItems = masterMenuItems
    .filter(item => hasPermission(item.key))
    .map((item, index) => ({
      key: item.key,
      icon: item.icon,
      label: `${index + 1}. ${item.rawLabel}`
    }));

  const deptColors = {
    TMS: '#0284c7',
    SMMS: '#d97706',
    TDMS: '#7c3aed',
    COA: '#059669'
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
          zIndex: 100,
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          {/* Top Fixed Section: Brand Logo & Region Selectors */}
          <div style={{ flexShrink: 0 }}>
            {/* Brand Crest & Title */}
            <div style={{
              height: 64,
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              borderBottom: '1px solid var(--ir-border)'
            }}>
              <img
                src="/indian_railways_logo.png"
                alt="Indian Railways Seal Logo"
                style={{
                  width: 38,
                  height: 38,
                  objectFit: 'contain',
                  flexShrink: 0
                }}
              />
              {!collapsed && (
                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                  <div style={{ fontWeight: 800, fontSize: 16, lineHeight: 1.2, color: 'var(--ir-text-main)', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    PRAGATI-RAIL
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--ir-text-sub)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                    Indian Railways
                  </div>
                </div>
              )}
            </div>

            {/* Operational Scope Filters: Zone & Division Selectors (Un-numbered) */}
            {!collapsed && (
              <div style={{ padding: '12px 16px 10px 16px', borderBottom: '1px solid var(--ir-border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 10, color: 'var(--ir-text-sub)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 2 }}>
                  OPERATIONAL SCOPE
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--ir-text-main)', marginBottom: 4, fontWeight: 600 }}>
                    Zone
                  </div>
                  <Select
                    value={selectedZone}
                    onChange={setSelectedZone}
                    style={{ width: '100%' }}
                    options={ZONES.map(z => ({ label: z.name, value: z.code }))}
                  />
                </div>

                <div>
                  <div style={{ fontSize: 11, color: 'var(--ir-text-main)', marginBottom: 4, fontWeight: 600 }}>
                    Division
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
          </div>

          {/* Scrollable Navigation Menu Section */}
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingTop: 8 }}>
            {!collapsed && (
              <div style={{ padding: '0 16px 6px 16px', fontSize: 10, color: 'var(--ir-text-sub)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                MODULES
              </div>
            )}
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              items={allowedMenuItems}
              onClick={({ key }) => navigate(key)}
              style={{ borderRight: 0, paddingBottom: 16 }}
            />
          </div>
        </div>
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
              <Tag color="green">PRAGATI AI Engine: Online</Tag>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Authenticated Department & User Info (Display-Only Badge) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--ir-bg)', padding: '4px 12px', borderRadius: 6, border: '1px solid var(--ir-border)' }}>
              <Tag color={deptColors[currentUser?.department || 'COA']} style={{ fontWeight: 700, margin: 0 }}>
                {currentUser?.department || 'COA'}
              </Tag>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ir-text-main)' }}>
                {currentUser?.name || 'Controller'}
              </span>
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

            {/* User Profile Avatar & Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 8, borderLeft: '1px solid var(--ir-border)' }}>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: deptColors[currentUser?.department || 'COA'] || '#1e3a8a' }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.1 }}>{currentUser?.name || 'Controller'}</div>
                <div style={{ fontSize: 10, color: 'var(--ir-text-sub)' }}>
                  {currentUser?.designation || 'Indian Railways'}
                </div>
              </div>
              <Tooltip title="Sign Out">
                <Button type="text" icon={<LogoutOutlined />} onClick={() => { logout(); navigate('/login'); }} />
              </Tooltip>
            </div>
          </div>
        </Header>

        {/* Viewport Content */}
        <Content style={{ margin: '20px', minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

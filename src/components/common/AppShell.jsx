import React, { useState } from 'react';
import { Layout, Menu, Button, Select, Badge, Avatar, Tag, Tooltip, Switch, Space } from 'antd';
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
  AimOutlined,
  LogoutOutlined,
  SwapOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRegion } from '../../context/RegionContext';
import { useAuth, DEMO_ACCOUNTS } from '../../context/AuthContext';

const { Header, Sider, Content } = Layout;

export const AppShell = ({ children, isDarkMode, setIsDarkMode, userRole, setUserRole }) => {
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

  const allMenuItems = [
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
    { key: '/tms', icon: <ToolOutlined style={{ color: '#0284c7' }} />, label: '6. TMS Track Maintenance' },
    { key: '/smms', icon: <ThunderboltOutlined style={{ color: '#d97706' }} />, label: '7. SMMS Signal & Telecom' },
    { key: '/tdms', icon: <BlockOutlined style={{ color: '#7c3aed' }} />, label: '8. TDMS Traction (OHE)' },
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

  // Filter menu items by user role permissions (RBAC Enforcement!)
  const allowedMenuItems = allMenuItems.filter(item => hasPermission(item.key));

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

            {/* Chained Region Controls: Zone & Division Selectors */}
            {!collapsed && (
              <div style={{ padding: '12px 16px 10px 16px', borderBottom: '1px solid var(--ir-border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--ir-text-sub)', marginBottom: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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
                  <div style={{ fontSize: 10, color: 'var(--ir-text-sub)', marginBottom: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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
          </div>

          {/* Scrollable Navigation Menu Section (Filtered by User Department Permissions) */}
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              items={allowedMenuItems}
              onClick={({ key }) => navigate(key)}
              style={{ borderRight: 0, paddingTop: 4, paddingBottom: 16 }}
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
              <Tag color="green">RAILWISE AI Engine: Online</Tag>
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

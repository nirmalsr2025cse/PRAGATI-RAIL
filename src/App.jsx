import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { lightTheme, darkTheme } from './theme/themeConfig';
import { RegionProvider } from './context/RegionContext';
import { AppShell } from './components/common/AppShell';

import { NetworkCommandCenterPage } from './pages/NetworkCommandCenterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AIResponsesPage } from './pages/AIResponsesPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { StationDisplayBoardPage } from './pages/StationDisplayBoardPage';
import { TMSManagerPage } from './pages/TMSManagerPage';
import { SMMSManagerPage } from './pages/SMMSManagerPage';
import { TDMSManagerPage } from './pages/TDMSManagerPage';
import { BDMSBlockPlannerPage } from './pages/BDMSBlockPlannerPage';
import { COADatabasePage } from './pages/COADatabasePage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userRole, setUserRole] = useState('Admin'); // 'Admin' | 'Manager' | 'Viewer'

  // Apply dark attribute to body for custom CSS variables
  useEffect(() => {
    if (isDarkMode) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  return (
    <ConfigProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <RegionProvider>
        <Router>
          <AppShell
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            userRole={userRole}
            setUserRole={setUserRole}
          >
            <Routes>
              <Route path="/" element={<NetworkCommandCenterPage userRole={userRole} />} />
              <Route path="/command-center" element={<NetworkCommandCenterPage userRole={userRole} />} />
              <Route path="/overview" element={<DashboardPage userRole={userRole} />} />
              <Route path="/ai-responses" element={<AIResponsesPage userRole={userRole} />} />
              <Route path="/digital-twin" element={<DigitalTwinPage userRole={userRole} />} />
              <Route path="/station-board" element={<StationDisplayBoardPage userRole={userRole} />} />
              <Route path="/tms" element={<TMSManagerPage userRole={userRole} />} />
              <Route path="/smms" element={<SMMSManagerPage userRole={userRole} />} />
              <Route path="/tdms" element={<TDMSManagerPage userRole={userRole} />} />
              <Route path="/bdms-planner" element={<BDMSBlockPlannerPage userRole={userRole} />} />
              <Route path="/coa-database" element={<COADatabasePage userRole={userRole} />} />
              <Route path="/alerts" element={<AlertsPage userRole={userRole} />} />
              <Route path="/reports" element={<ReportsPage userRole={userRole} />} />
              <Route path="/settings" element={<SettingsPage userRole={userRole} setUserRole={setUserRole} />} />
            </Routes>
          </AppShell>
        </Router>
      </RegionProvider>
    </ConfigProvider>
  );
}

export default App;

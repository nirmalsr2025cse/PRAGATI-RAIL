import React, { createContext, useContext, useState } from 'react';

// Official CRIS / Indian Railways Role Profiles (Stored internally for authentication validation)
export const DEMO_ACCOUNTS = [
  {
    userId: 'user_tms',
    password: 'rail123',
    name: 'Rajesh Sharma',
    designation: 'Senior Section Engineer (Track / TMS)',
    department: 'TMS',
    zone: 'Northern Railway',
    division: 'Lucknow',
    defaultRoute: '/tms',
    allowedRoutes: ['/ai-responses', '/digital-twin', '/tms', '/bdms-planner', '/alerts', '/reports']
  },
  {
    userId: 'user_smms',
    password: 'rail123',
    name: 'Priya Verma',
    designation: 'Senior Section Engineer (Signal / SMMS)',
    department: 'SMMS',
    zone: 'Northern Railway',
    division: 'Lucknow',
    defaultRoute: '/smms',
    allowedRoutes: ['/ai-responses', '/digital-twin', '/smms', '/bdms-planner', '/alerts', '/reports']
  },
  {
    userId: 'user_tdms',
    password: 'rail123',
    name: 'Amitabh Sen',
    designation: 'Senior Section Engineer (Traction OHE / TDMS)',
    department: 'TDMS',
    zone: 'Northern Railway',
    division: 'Lucknow',
    defaultRoute: '/tdms',
    allowedRoutes: ['/ai-responses', '/digital-twin', '/tdms', '/bdms-planner', '/alerts', '/reports']
  },
  {
    userId: 'user_coa',
    password: 'rail123',
    name: 'Vikramaditya Rao',
    designation: 'Chief Controller (Control Office Application)',
    department: 'COA',
    zone: 'Northern Railway',
    division: 'Lucknow',
    defaultRoute: '/command-center',
    allowedRoutes: ['/command-center', '/overview', '/ai-responses', '/digital-twin', '/tms', '/smms', '/tdms', '/bdms-planner', '/coa-database', '/station-board', '/alerts', '/reports', '/settings']
  }
];

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize user session from sessionStorage or default to COA controller
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = sessionStorage.getItem('pragati_rail_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return DEMO_ACCOUNTS[3]; // Default to COA Controller
  });

  const [lastLoginTime, setLastLoginTime] = useState(new Date().toLocaleTimeString());

  const login = (userId, password) => {
    const account = DEMO_ACCOUNTS.find(acc => acc.userId.toLowerCase() === userId.toLowerCase() && acc.password === password);
    if (account) {
      setCurrentUser(account);
      setLastLoginTime(new Date().toLocaleTimeString());
      sessionStorage.setItem('pragati_rail_user', JSON.stringify(account));
      return { success: true, user: account };
    }
    return { success: false, message: 'Invalid CRIS User ID or Password' };
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('pragati_rail_user');
  };

  const hasPermission = (routePath) => {
    if (!currentUser) return false;
    const targetRoute = routePath === '/' ? currentUser.defaultRoute : routePath;
    return currentUser.allowedRoutes.includes(targetRoute);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      lastLoginTime,
      login,
      logout,
      hasPermission,
      DEMO_ACCOUNTS
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

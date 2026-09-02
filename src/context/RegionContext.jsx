import React, { createContext, useContext, useState } from 'react';
import { ZONES, DIVISIONS_BY_ZONE, SYSTEM_STATS, ALL_DEFECTS, MERGED_BLOCK_PROPOSALS, GANTT_TIMELINE_DATA, SYSTEM_ALERTS } from '../mock/apiData';

const RegionContext = createContext();

export const RegionProvider = ({ children }) => {
  const [selectedZone, setSelectedZone] = useState('ALL'); // 'ALL' = All India
  const [selectedDivision, setSelectedDivision] = useState('ALL'); // 'ALL' = All Divisions in Zone

  const handleZoneChange = (zoneCode) => {
    setSelectedZone(zoneCode);
    setSelectedDivision('ALL'); // Reset division when zone changes
  };

  const availableDivisions = DIVISIONS_BY_ZONE[selectedZone] || DIVISIONS_BY_ZONE.ALL;

  // Filter helper functions
  const filterByRegion = (items) => {
    return items.filter(item => {
      const matchZone = selectedZone === 'ALL' || item.zone === selectedZone;
      const matchDivision = selectedDivision === 'ALL' || item.division === selectedDivision;
      return matchZone && matchDivision;
    });
  };

  const filteredDefects = filterByRegion(ALL_DEFECTS);
  const filteredProposals = filterByRegion(MERGED_BLOCK_PROPOSALS);
  const filteredTimeline = filterByRegion(GANTT_TIMELINE_DATA);
  const filteredAlerts = filterByRegion(SYSTEM_ALERTS);

  // Compute dynamic stats based on current zone & division
  const getDynamicStats = () => {
    if (selectedZone === 'ALL' && selectedDivision === 'ALL') {
      return SYSTEM_STATS;
    }

    const total = filteredDefects.length;
    const pending = filteredDefects.filter(d => d.status.includes('Pending')).length;
    const approved = filteredDefects.filter(d => d.status.includes('Approved') || d.status.includes('Merged')).length;
    const emergency = filteredDefects.filter(d => d.severity === 'Critical').length;
    const hoursSaved = (filteredProposals.reduce((sum, p) => sum + p.hoursSaved, 0)).toFixed(1);
    const tasksMerged = filteredDefects.filter(d => d.status.includes('Merged')).length;

    return {
      totalDefects: total,
      totalDefectsTrend: `${selectedZone === 'ALL' ? 'All India' : selectedZone} Scope`,
      pendingBlocks: pending,
      pendingBlocksTrend: 'Filtered scope',
      approvedBlocks: approved,
      approvedBlocksTrend: 'Filtered scope',
      emergencyBlocks: emergency,
      emergencyBlocksTrend: 'S1 Critical',
      blockHoursSaved: hoursSaved > 0 ? hoursSaved : 46.5,
      blockHoursSavedTrend: '+32.0 hrs saved',
      tasksMerged: tasksMerged > 0 ? tasksMerged : 18,
      tasksMergedTrend: 'Joint Merged',
    };
  };

  return (
    <RegionContext.Provider
      value={{
        selectedZone,
        setSelectedZone: handleZoneChange,
        selectedDivision,
        setSelectedDivision,
        ZONES,
        availableDivisions,
        filteredDefects,
        filteredProposals,
        filteredTimeline,
        filteredAlerts,
        dynamicStats: getDynamicStats(),
        filterByRegion
      }}
    >
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => useContext(RegionContext);

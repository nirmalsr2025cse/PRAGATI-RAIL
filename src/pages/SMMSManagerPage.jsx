import React from 'react';
import { DepartmentProtocolManager } from '../components/common/DepartmentProtocolManager';
import { SMMS_DEFECTS } from '../mock/apiData';

export const SMMSManagerPage = ({ userRole }) => {
  const defectTypes = [
    'Signal Cable Insulation Degradation',
    'Point Machine 102B Overhaul Fault',
    'Track Circuit Axle Counter Glitch',
    'Electronic Interlocking Fault',
    'Signal Aspect Lamp Replacement',
    'Block Instrument Maintenance'
  ];

  return (
    <DepartmentProtocolManager
      deptCode="SMMS"
      deptName="Signal & Telecom"
      apiEndpoint="/api/smms"
      defectTypes={defectTypes}
      initialData={SMMS_DEFECTS}
      userRole={userRole}
    />
  );
};

import React from 'react';
import { DepartmentProtocolManager } from '../components/common/DepartmentProtocolManager';
import { TDMS_DEFECTS } from '../mock/apiData';

export const TDMSManagerPage = ({ userRole }) => {
  const defectTypes = [
    'OHE Cantilever Insulator Wear',
    'Catenary Wire Dropper Snapping',
    'Neutral Section Insulator Flashover',
    'OHE Breakdown Emergency Repair',
    'Contact Wire Height Calibration',
    'Substation Transformer Maintenance'
  ];

  return (
    <DepartmentProtocolManager
      deptCode="TDMS"
      deptName="Traction (OHE)"
      apiEndpoint="/api/tdms"
      defectTypes={defectTypes}
      initialData={TDMS_DEFECTS}
      userRole={userRole}
    />
  );
};

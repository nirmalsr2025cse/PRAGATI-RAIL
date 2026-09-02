import { apiClient } from './apiClient';
import { INITIAL_TMS_DEFECTS } from '../mock/apiData';

export const tmsService = {
  // GET /api/tms/defects — Fetch all track defects
  async getDefects(zone = 'ALL', division = 'ALL') {
    try {
      const response = await apiClient.get('/tms/defects', { params: { zone, division } });
      return response.data;
    } catch (error) {
      console.warn('Backend endpoint unavailable. Falling back to local synthetic mock data.', error);
      return INITIAL_TMS_DEFECTS;
    }
  },

  // POST /api/tms/defects — Create a new track defect (Calculates 13 system AI outputs)
  async createDefect(manualInputData) {
    try {
      const response = await apiClient.post('/tms/defects', manualInputData);
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable. Simulating client-side calculation engine.', error);
      // Simulate client-side response calculation fallback
      const now = new Date();
      const slaDays = manualInputData.Severity_Level === 'Critical' ? 1 : manualInputData.Severity_Level === 'High' ? 3 : 7;
      const dueDate = new Date(now.getTime() + slaDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      return {
        ...manualInputData,
        Defect_ID: `TMS-${Math.floor(100 + Math.random() * 900)}`,
        Due_Date: dueDate,
        Overdue_Days: 0,
        Joint_Block_Feasibility_Score: 92.5,
        Task_Urgency_Tier: manualInputData.Severity_Level === 'Critical' ? 'S1 Immediate' : 'S2 High',
        Planning_Horizon: 'Next 24 Hours',
        Recommended_Block_Date: new Date(now.getTime() + 12 * 60 * 60 * 1000).toISOString().split('T')[0],
        Recommended_Block_Duration_Hours: 2.5,
        Joint_Block_Recommendation: 'Merge with S&T Point Calibration #SMMS-104 & OHE Tension Inspection #TDMS-088',
        Priority_Score: manualInputData.Severity_Level === 'Critical' ? 95 : 78,
        Predicted_Resolution_Time_Hours: 3.5,
        Risk_If_Delayed: 'Speed Restriction Required',
        Confidence_Score: 94.2
      };
    }
  }
};

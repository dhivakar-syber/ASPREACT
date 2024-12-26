import http from '../httpService';

import {SupplierDashboardInput} from '../../scenes/Dashboard/components/PayRetroSupplierDashboard/DashboardInput'

class supplementarySummariesService{

    public async loadsupplementarySummary(input: SupplierDashboardInput) {
        try {
          
          const result = await http.get(
            'api/services/app/SupplementarySummaries/GetAllsupplementarySummaryTest',{ params: input },
             
          );
          return result;
        } catch (error) {
          console.error('Error fetching supplementary summaries:', error);
          throw error; 
        }
      }

}
export default new supplementarySummariesService();
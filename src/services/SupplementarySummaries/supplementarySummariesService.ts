import {CreateOrEditSupplementarySummaryDto} from './dto/createOrEditSupplementarySummaryDto';
import { EntityDto } from '../../services/dto/entityDto';
import { GetSupplementarySummaryForViewDto } from './dto/getSupplementarySummaryForViewDto';
import {GetSupplementarySummaryForEditOutput} from './dto/getSupplementarySummaryForEditOutput';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import {PagedSupplementarySummaryResultRequestDto} from './dto/PagedSupplementarySummaryResultRequestDto';
import {SupplementarySummaryPartLookupTableDto} from './dto/supplementarySummaryPartLookupTableDto';
import {supplementarySummaryBuyerLookupTableDto} from './dto/supplementarySummaryBuyerLookupTableDto';
import {SupplementarySummarySupplierLookupTableDto} from './dto/supplementarySummarySupplierLookupTableDto';
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

      public async grndata(id: number) {
        try {
          
          const result = await http.get(
            'api/services/app/SupplementarySummaries/Getgrndbfcdetail',{ params: { supplementaryid:id } },
             
          );
          return result.data.result;
        } catch (error) {
          console.error('Error fetching supplementary summaries:', error);
          throw error; 
        }
      }

      public async annexuredata(id: number) {
        try {
          
          const result = await http.get(
            'api/services/app/SupplementarySummaries/GetAllSupplementaryInvoice',{ params: { supplementaryid:id } },
             
          );
          return result.data.result;
        } catch (error) {
          console.error('Error fetching supplementary summaries:', error);
          throw error; 
        }
      }

      public async create(createOrEditSupplementarySummaryDto: CreateOrEditSupplementarySummaryDto) {
        let result = await http.post('api/services/app/SupplementarySummaries/CreateOrEdit', createOrEditSupplementarySummaryDto);
        return result.data.result;
      }
    
      public async delete(entityDto: EntityDto) {
        let result = await http.delete('api/services/app/SupplementarySummaries/Delete', { params: entityDto });
        return result.data;
      }
    
      public async get(entityDto: EntityDto): Promise<GetSupplementarySummaryForEditOutput> {
        let result = await http.get('api/services/app/SupplementarySummaries/GetSupplementarySummaryForEdit', { params: entityDto });
        return result.data.result;
      }
    
      public async getAll(pagedFilterAndSortedRequest: PagedSupplementarySummaryResultRequestDto): Promise<PagedResultDto<GetSupplementarySummaryForViewDto>> {
        let result = await http.get('api/services/app/SupplementarySummaries/GetAll', { params: pagedFilterAndSortedRequest });
        return result.data.result;
      }
    
      public async update(createOrEditSupplementarySummaryDto: CreateOrEditSupplementarySummaryDto) {
        let result = await http.post('api/services/app/SupplementarySummaries/CreateOrEdit', createOrEditSupplementarySummaryDto);
        return result.data.result;
      }
    
      public async getAllPartForLookupTable(pagedFilterAndSortedRequest: PagedSupplementarySummaryResultRequestDto): Promise<PagedResultDto<SupplementarySummaryPartLookupTableDto>>{
        let result = await http.get('api/services/app/SupplementarySummaries/GetAllPartForLookupTable', { params: pagedFilterAndSortedRequest });
        return result.data.result;
      }
    
      public async getAllBuyerForLookupTable(pagedFilterAndSortedRequest: PagedSupplementarySummaryResultRequestDto): Promise<PagedResultDto<supplementarySummaryBuyerLookupTableDto>>{
        let result = await http.get('api/services/app/SupplementarySummaries/GetAllBuyerForLookupTable', { params: pagedFilterAndSortedRequest });
        return result.data.result;
      }
      public async getAllSupplierForLookupTable(pagedFilterAndSortedRequest: PagedSupplementarySummaryResultRequestDto): Promise<PagedResultDto<SupplementarySummarySupplierLookupTableDto>>{
        let result = await http.get('api/services/app/SupplementarySummaries/GetAllSupplierForLookupTable', { params: pagedFilterAndSortedRequest });
        return result.data.result;
      }     
}
export default new supplementarySummariesService();
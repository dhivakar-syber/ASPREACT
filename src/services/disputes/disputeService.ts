import { CreateOrEditDisputeDto } from './dto/CreateOrEditDisputeDto';
//import { DisputeDto } from './dto/DisputeDto';
// import { GetAllDisputesInput } from './dto/GetAllDisputesInput';
import {PagedTenantResultRequestDto} from './dto/PagedTenantResultRequestDto';
import { EntityDto } from '../../services/dto/entityDto';
import { PagedResultDto } from '../dto/pagedResultDto';
import { GetDisputeForViewDto } from './dto/GetDisputeForViewDto';
import { DisputeBuyerLookupTableDto } from './dto/DisputeBuyerLookupTableDto';
import { DisputeSupplementarySummaryLookupTableDto } from './dto/DisputeSupplementarySummaryLookupTableDto';
import { DisputeSupplierLookupTableDto } from './dto/DisputeSupplierLookupTableDto';
import { DisputeSupplierRejectionLookupTableDto } from './dto/DisputeSupplierRejectionLookupTableDto';
import { GetAllForLookupTableInput } from './dto/GetAllForLookupTableInput';
import { GetAllDisputesOutput } from './dto/GetAllDisputesOutput';

import http from '../httpService';

class disputeService {
  public async create(createOrEditDisputeDto: CreateOrEditDisputeDto) {
    let result = await http.post('/api/services/app/Disputes/CreateOrEdit', createOrEditDisputeDto);
    return result.data.result;
  }

  public async update(createOrEditDisputeDto: CreateOrEditDisputeDto) {
    let result = await http.post('/api/services/app/Disputes/CreateOrEdit', createOrEditDisputeDto);
    return result.data.result;
  }

  public async get(entityDto: EntityDto): Promise<GetAllDisputesOutput> {
    let result = await http.get('/api/services/app/Disputes/GetDisputeForEdit', { params: entityDto });
    return result.data.result;
  }

  public async getAll(pagedFilterAndSortedRequest: PagedTenantResultRequestDto): Promise<PagedResultDto<GetDisputeForViewDto>> {
    console.log('hello');
    let result = await http.get('/api/services/app/Disputes/GetAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async GetDisputeForView(pagedFilterAndSortedRequest: PagedTenantResultRequestDto): Promise<PagedResultDto<GetDisputeForViewDto>> {
    let result = await http.get('/api/services/app/Disputes/GetDisputeForView', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async getAllSupplementaryForLookupTable(pagedFilterAndSortedRequest: PagedTenantResultRequestDto): Promise<PagedResultDto<DisputeBuyerLookupTableDto>>{
    let result = await http.get('/api/services/app/Disputes/GetAllSupplementarySummaryForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async getAllRejectionForLookupTable(pagedFilterAndSortedRequest: PagedTenantResultRequestDto): Promise<PagedResultDto<DisputeSupplementarySummaryLookupTableDto>>{
    let result = await http.get('/api/services/app/Disputes/GetAllSupplierRejectionForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }
  public async getAllForSupplierLookupTable(pagedFilterAndSortedRequest: PagedTenantResultRequestDto): Promise<PagedResultDto<DisputeSupplierLookupTableDto>>{
    let result = await http.get('/api/services/app/Disputes/GetAllSupplierForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }
  public async getAllBuyerLookupTable(pagedFilterAndSortedRequest: PagedTenantResultRequestDto): Promise<PagedResultDto<DisputeSupplierRejectionLookupTableDto>>{
    let result = await http.get('/api/services/app/Disputes/GetAllBuyerForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }
  public async GetAllForLookupInput(pagedFilterAndSortedRequest: PagedTenantResultRequestDto): Promise<PagedResultDto<GetAllForLookupTableInput>>{
    let result = await http.get('/api/services/app/Disputes/CreateOrEdit', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }
  public async getBuyercloseEdit(pagedFilterAndSortedRequest: PagedTenantResultRequestDto): Promise<PagedResultDto<GetDisputeForViewDto>> {
    let result = await http.get('/api/services/app/Disputes/BuyercloseEdit', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }
  public async getBuyerAccountsForwardEdit(pagedFilterAndSortedRequest: PagedTenantResultRequestDto): Promise<PagedResultDto<GetDisputeForViewDto>> {
    let result = await http.get('/api/services/app/Disputes/BuyerAccountsForwardEdit', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }
  public async delete(entityDto: EntityDto){
    let result = await http.delete('/api/services/app/Disputes/Delete', { params: entityDto });
    return result.data.result;
  }
 

}

export default new disputeService();

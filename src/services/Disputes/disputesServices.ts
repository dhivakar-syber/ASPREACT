import {CreateOrEditDisputeDto} from './dto/CreateOrEditDisputeDto';
import { EntityDto } from '../../services/dto/entityDto';
import { GetDisputeForViewDto } from './dto/GetDisputeForViewDto';
import {GetDisputeForEditOutput} from './dto/GetDisputeForEditOutput';
import { GetAllDisputesInput } from './dto/GetAllDisputesInput';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import {PagedDisputesResultRequestDto} from './dto/PagedDisputesResultRequestDto';
import {DisputeSupplementarySummaryLookupTableDto} from './dto/DisputeSupplementarySummaryLookupTableDto';
import {DisputeBuyerLookupTableDto} from './dto/DisputeBuyerLookupTableDto';
import {DisputeSupplierLookupTableDto} from './dto/DisputeSupplierLookupTableDto';
import {DisputeSupplierRejectionLookupTableDto} from './dto/DisputeSupplierRejectionLookupTableDto';
import http from '../httpService';

class disputesService {
  public async create(createOrEditDisputeDto: CreateOrEditDisputeDto) {
    let result = await http.post('api/services/app/Disputes/CreateOrEdit', createOrEditDisputeDto);
    return result.data.result;
  }

  

  public async delete(entityDto: EntityDto) {
    let result = await http.delete('api/services/app/Disputes/Delete', { params: entityDto });
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<GetDisputeForEditOutput> {
    let result = await http.get('api/services/app/Disputes/GetDisputeForEdit', { params: entityDto });
    return result.data.result;
  }

  public async supplierget(entityDto: EntityDto): Promise<GetDisputeForEditOutput> {
    let result = await http.get('api/services/app/Disputes/SupplierGetDisputeForEdit', { params: entityDto });
    return result.data.result;
  }

  public async buyerget(entityDto: EntityDto): Promise<GetDisputeForEditOutput> {
    let result = await http.get('api/services/app/Disputes/BuyerGetDisputeForEdit', { params: entityDto });
    return result.data.result;
  }

  public async accountget(entityDto: EntityDto): Promise<GetDisputeForEditOutput> {
    let result = await http.get('api/services/app/Disputes/GetDisputeForAccountsEdit', { params: entityDto });
    return result.data.result;
  }

  public async getAll(pagedFilterAndSortedRequest: PagedDisputesResultRequestDto): Promise<PagedResultDto<GetDisputeForViewDto>> {
    let result = await http.get('api/services/app/Disputes/GetAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async suppliergetAll(getAllDisputesInput: GetAllDisputesInput): Promise<PagedResultDto<GetAllDisputesInput>> {
    const input = {
        SupplementarySummaryId: getAllDisputesInput.SupplementarySummaryId,
        Filter: getAllDisputesInput.Filter,
        QueryFilter: getAllDisputesInput.QueryFilter,
        BuyerRemarksFilter: getAllDisputesInput.BuyerRemarksFilter,
        StatusFilter: getAllDisputesInput.StatusFilter,
        SupplementarySummaryDisplayPropertyFilter: getAllDisputesInput.SupplementarySummaryDisplayPropertyFilter,
        SupplierRejectionCodeFilter: getAllDisputesInput.SupplierRejectionCodeFilter,
        SupplierCodeFilter: getAllDisputesInput.SupplierCodeFilter,
        BuyerShortIdFilter: getAllDisputesInput.BuyerShortIdFilter,
        PagedDisputesResultRequestDto: {
            maxResultCount: getAllDisputesInput.PagedDisputesResultRequestDto.maxResultCount,
            skipCount: getAllDisputesInput.PagedDisputesResultRequestDto.skipCount,
            keyword: getAllDisputesInput.PagedDisputesResultRequestDto.keyword
        }
    };

    const result = await http.post('api/services/app/Disputes/SupplierSummaryGetAll', input);
    return result.data.result;
}



  public async buyergetAll(pagedFilterAndSortedRequest: PagedDisputesResultRequestDto): Promise<PagedResultDto<GetDisputeForViewDto>> {
    let result = await http.post('api/services/app/Disputes/BuyerGetAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async accountgetAll(pagedFilterAndSortedRequest: PagedDisputesResultRequestDto): Promise<PagedResultDto<GetDisputeForViewDto>> {
    let result = await http.post('api/services/app/Disputes/AccountsGetAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async update(createOrEditDisputeDto: CreateOrEditDisputeDto) {
    let result = await http.post('api/services/app/Disputes/CreateOrEdit', createOrEditDisputeDto);
    return result.data.result;
  }

  public async accountsForwardupdate(createOrEditDisputeDto: CreateOrEditDisputeDto) {
    let result = await http.post('api/services/app/Disputes/BuyerAccountsForwardEdit', createOrEditDisputeDto);
    return result.data.result;
  }

  public async buyercloseupdate(createOrEditDisputeDto: CreateOrEditDisputeDto) {
    let result = await http.post('api/services/app/Disputes/BuyercloseEdit', createOrEditDisputeDto);
    return result.data.result;
  }

  public async accountupdate(createOrEditDisputeDto: CreateOrEditDisputeDto) {
    let result = await http.post('api/services/app/Disputes/AccountsEdit', createOrEditDisputeDto);
    return result.data.result;
  }

  public async getAllsuppliersummariesForLookupTable(pagedFilterAndSortedRequest: PagedDisputesResultRequestDto): Promise<PagedResultDto<DisputeSupplementarySummaryLookupTableDto>>{
    let result = await http.get('api/services/app/Disputes/GetAllSupplementarySummaryForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }
  public async getAllsupplierrejectionForLookupTable(pagedFilterAndSortedRequest: PagedDisputesResultRequestDto): Promise<PagedResultDto<DisputeSupplierRejectionLookupTableDto>>{
    let result = await http.get('api/services/app/Disputes/GetAllSupplierRejectionForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async getAllBuyerForLookupTable(pagedFilterAndSortedRequest: PagedDisputesResultRequestDto): Promise<PagedResultDto<DisputeBuyerLookupTableDto>>{
    let result = await http.get('api/services/app/Disputes/GetAllBuyerForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }
  
  

  public async getAllSupplierForLookupTable(pagedFilterAndSortedRequest: PagedDisputesResultRequestDto): Promise<PagedResultDto<DisputeSupplierLookupTableDto>>{
    let result = await http.get('api/services/app/Disputes/GetAllSupplierForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async buyermail(DocId: number) {
    try {
      const result = await http.get('api/services/app/Disputes/GetBuyerMail', {
        params: { DocId } // Use an object to pass parameters
      });
      return result.data.result; // Access the nested result
    } catch (error) {
      console.error('Error fetching buyer mail:', error);
      throw error; // Re-throw the error for further handling
    }
  }

  public async getBuyerAndSupplierNameAsync(id: number | string): Promise<any> {
    try {
      const response = await http.get('api/services/app/Disputes/GetBuyerAndSupplierName', {
        params: { id },
      });
      return response.data.result;
    } catch (error) {
      console.error('Error fetching buyer and supplier name:', error);
      throw error; // Rethrow the error to let the caller handle it
    }
  }
  
}

export default new disputesService();

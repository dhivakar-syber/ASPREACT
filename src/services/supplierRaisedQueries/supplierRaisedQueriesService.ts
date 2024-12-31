import {CreateOrEditSupplierRaisedQueryDto} from './dto/createOrEditSupplierRaisedQueryDto';
import { EntityDto } from '../dto/entityDto';
import { GetSupplierRaisedQueryForViewDto } from './dto/getSupplierRaisedQueryForViewDto';
import {GetSupplierRaisedQueryForEditOutput} from './dto/getSupplierRaisedQueryForEditOutput';
import { PagedResultDto } from '../dto/pagedResultDto';
import {PagedSupplierRaisedQueryResultRequestDto} from './dto/PagedSupplierRaisedQueryResultRequestDto';
import {SupplierRaisedQueryPartLookupTableDto} from './dto/supplierRaisedQueryPartLookupTableDto';
import {SupplierRaisedQueryBuyerLookupTableDto} from './dto/supplierRaisedQueryBuyerLookupTableDto';
import {SupplierRaisedQuerySupplierLookupTableDto} from './dto/supplierRaisedQuerySupplierLookupTableDto';
import http from '../httpService';

class supplierRaisedQueriesService {
  public async create(createOrEditSupplierRaisedQueryDto: CreateOrEditSupplierRaisedQueryDto) {
    let result = await http.post('api/services/app/SupplierRaisedQueries/CreateOrEdit', createOrEditSupplierRaisedQueryDto);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete('api/services/app/SupplierRaisedQueries/Delete', { params: entityDto });
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<GetSupplierRaisedQueryForEditOutput> {
    let result = await http.get('api/services/app/SupplierRaisedQueries/GetSupplierRaisedQueryForEdit', { params: entityDto });
    return result.data.result;
  }

  public async getAll(pagedFilterAndSortedRequest: PagedSupplierRaisedQueryResultRequestDto): Promise<PagedResultDto<GetSupplierRaisedQueryForViewDto>> {
    let result = await http.get('api/services/app/SupplierRaisedQueries/GetAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async update(createOrEditSupplierRaisedQueryDto: CreateOrEditSupplierRaisedQueryDto) {
    let result = await http.post('api/services/app/SupplierRaisedQueries/CreateOrEdit', createOrEditSupplierRaisedQueryDto);
    return result.data.result;
  }

  public async getAllPartForLookupTable(pagedFilterAndSortedRequest: PagedSupplierRaisedQueryResultRequestDto): Promise<PagedResultDto<SupplierRaisedQueryPartLookupTableDto>>{
    let result = await http.get('api/services/app/SupplierRaisedQueries/GetAllPartForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async getAllBuyerForLookupTable(pagedFilterAndSortedRequest: PagedSupplierRaisedQueryResultRequestDto): Promise<PagedResultDto<SupplierRaisedQueryBuyerLookupTableDto>>{
    let result = await http.get('api/services/app/SupplierRaisedQueries/GetAllBuyerForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }
  public async getAllSupplierForLookupTable(pagedFilterAndSortedRequest: PagedSupplierRaisedQueryResultRequestDto): Promise<PagedResultDto<SupplierRaisedQuerySupplierLookupTableDto>>{
    let result = await http.get('api/services/app/SupplierRaisedQueries/GetAllSupplierForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async inportExceldata(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);  // Append the file to FormData

    // Sending the request with the FormData containing the file
    let result = await http.post('api/services/app/SupplierRaisedQueries/ImportCBFCDataFromExcel', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'  // Ensure the Content-Type is set for file uploads
        }
    });

    return result.data.result;
  }
}

export default new supplierRaisedQueriesService();

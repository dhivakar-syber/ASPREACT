import {CreateOrEditCBFCdataDto} from './dto/createOrEditCBFCdataDto';
import { EntityDto } from '../../services/dto/entityDto';
import { GetCBFCdataForViewDto } from './dto/getCBFCdataForViewDto';
import {GetCBFCdataForEditOutput} from './dto/getCBFCdataForEditOutput';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import {PagedTenantResultRequestDto} from './dto/PagedTenantResultRequestDto';
import {CBFCdataPartLookupTableDto} from './dto/cbfcdataPartLookupTableDto';
import {CBFCdataBuyerLookupTableDto} from './dto/cbfcdataBuyerLookupTableDto';
import {CBFCdataSupplierLookupTableDto} from './dto/cbfcdataSupplierLookupTableDto';
import http from '../httpService';

class cbfcdataService {
  public async create(createOrEditCBFCdataDto: CreateOrEditCBFCdataDto) {
    let result = await http.post('api/services/app/CBFCdatas/CreateOrEdit', createOrEditCBFCdataDto);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete('api/services/app/CBFCdatas/Delete', { params: entityDto });
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<GetCBFCdataForEditOutput> {
    let result = await http.get('api/services/app/CBFCdatas/GetCBFCdataForEdit', { params: entityDto });
    return result.data.result;
  }

  public async getAll(pagedFilterAndSortedRequest: PagedTenantResultRequestDto): Promise<PagedResultDto<GetCBFCdataForViewDto>> {
    let result = await http.get('api/services/app/CBFCdatas/GetAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async update(createOrEditCBFCdataDto: CreateOrEditCBFCdataDto) {
    let result = await http.post('api/services/app/CBFCdatas/CreateOrEdit', createOrEditCBFCdataDto);
    return result.data.result;
  }

  public async getAllPartForLookupTable(pagedFilterAndSortedRequest: PagedTenantResultRequestDto): Promise<PagedResultDto<CBFCdataPartLookupTableDto>>{
    let result = await http.get('api/services/app/CBFCdatas/GetAllPartForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async getAllBuyerForLookupTable(pagedFilterAndSortedRequest: PagedTenantResultRequestDto): Promise<PagedResultDto<CBFCdataBuyerLookupTableDto>>{
    let result = await http.get('api/services/app/CBFCdatas/GetAllBuyerForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }
  public async getAllSupplierForLookupTable(pagedFilterAndSortedRequest: PagedTenantResultRequestDto): Promise<PagedResultDto<CBFCdataSupplierLookupTableDto>>{
    let result = await http.get('api/services/app/CBFCdatas/GetAllSupplierForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async inportExceldata(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);  // Append the file to FormData

    // Sending the request with the FormData containing the file
    let result = await http.post('api/services/app/CBFCdatas/ImportCBFCDataFromExcel', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'  // Ensure the Content-Type is set for file uploads
        }
    });

    return result.data.result;
  }
}

export default new cbfcdataService();

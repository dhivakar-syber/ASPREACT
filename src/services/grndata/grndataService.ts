import {CreateOrEditGRNdataDto} from './dto/createOrEditGRNdataDto';
import { EntityDto } from '../../services/dto/entityDto';
import { GetGRNdataForViewDto } from './dto/getGRNdataForViewDto';
import {GetGRNdataForEditOutput} from './dto/getGRNdataForEditOutput';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import {PagedGRNResultRequestDto} from './dto/PagedGRNResultRequestDto';
import {GRNdataPartLookupTableDto} from './dto/grndataPartLookupTableDto';
import {GRNdataBuyerLookupTableDto} from './dto/grndataBuyerLookupTableDto';
import {GRNdataSupplierLookupTableDto} from './dto/grndataSupplierLookupTableDto';
import http from '../httpService';

class grndataService {
  public async create(createOrEditGRNdataDto: CreateOrEditGRNdataDto) {
    let result = await http.post('api/services/app/GRNMasters/CreateOrEdit', createOrEditGRNdataDto);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete('api/services/app/GRNMasters/Delete', { params: entityDto });
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<GetGRNdataForEditOutput> {
    let result = await http.get('api/services/app/GRNMasters/GetGRNMasterForEdit', { params: entityDto });
    return result.data.result;
  }

  public async getAll(pagedFilterAndSortedRequest: PagedGRNResultRequestDto): Promise<PagedResultDto<GetGRNdataForViewDto>> {
    let result = await http.get('api/services/app/GRNMasters/GetAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async update(createOrEditGRNdataDto: CreateOrEditGRNdataDto) {
    let result = await http.post('api/services/app/GRNMasters/CreateOrEdit', createOrEditGRNdataDto);
    return result.data.result;
  }

  public async getAllPartForLookupTable(pagedFilterAndSortedRequest: PagedGRNResultRequestDto): Promise<PagedResultDto<GRNdataPartLookupTableDto>>{
    let result = await http.get('api/services/app/GRNMasters/GetAllPartForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async getAllBuyerForLookupTable(pagedFilterAndSortedRequest: PagedGRNResultRequestDto): Promise<PagedResultDto<GRNdataBuyerLookupTableDto>>{
    let result = await http.get('api/services/app/GRNMasters/GetAllBuyerForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }
  public async getAllSupplierForLookupTable(pagedFilterAndSortedRequest: PagedGRNResultRequestDto): Promise<PagedResultDto<GRNdataSupplierLookupTableDto>>{
    let result = await http.get('api/services/app/GRNMasters/GetAllSupplierForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }
  public async inportExceldata(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);  // Append the file to FormData

    // Sending the request with the FormData containing the file
    let result = await http.post('api/services/app/GRNMasters/ImportGRNDataFromExcel', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'  // Ensure the Content-Type is set for file uploads
        }
    });

    return result.data.result;
  }
}

export default new grndataService();

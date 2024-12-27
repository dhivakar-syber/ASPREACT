import {CreateOrEditFileMasterDto} from './dto/CreateOrEditFileMasterDto';
import { EntityDto } from '../../services/dto/entityDto';
import { GetFileMasterForViewDto } from './dto/GetFileMasterForViewDto';
import {GetFileMasterForEditOutput} from './dto/GetFileMasterForEditOutput';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import {PagedFileMasterResultRequestDto} from './dto/PagedFileMasterResultRequestDto';
import {FileMasterPartLookupTableDto} from './dto/FileMasterPartLookupTableDto';
import {FileMasterBuyerLookupTableDto} from './dto/FileMasterBuyerLookupTableDto';
import {FileMasterSupplierLookupTableDto} from './dto/FileMasterSupplierLookupTableDto';
import http from '../httpService';

class filemasterservices {
  public async create(createOrEditFileMasterDto: CreateOrEditFileMasterDto) {
    let result = await http.post('api/services/app/FileMasters/CreateOrEdit', createOrEditFileMasterDto);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete('api/services/app/FileMasters/Delete', { params: entityDto });
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<GetFileMasterForEditOutput> {
    let result = await http.get('api/services/app/FileMasters/GetFileMasterForEdit', { params: entityDto });
    return result.data.result;
  }

  public async getAll(pagedFilterAndSortedRequest: PagedFileMasterResultRequestDto): Promise<PagedResultDto<GetFileMasterForViewDto>> {
    let result = await http.get('api/services/app/FileMasters/GetAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async update(createOrEditGRNdataDto: CreateOrEditFileMasterDto) {
    let result = await http.post('api/services/app/FileMasters/CreateOrEdit', createOrEditGRNdataDto);
    return result.data.result;
  }

  public async getAllPartForLookupTable(pagedFilterAndSortedRequest: PagedFileMasterResultRequestDto): Promise<PagedResultDto<FileMasterPartLookupTableDto>>{
    let result = await http.get('api/services/app/FileMasters/GetAllPartForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async getAllBuyerForLookupTable(pagedFilterAndSortedRequest: PagedFileMasterResultRequestDto): Promise<PagedResultDto<FileMasterBuyerLookupTableDto>>{
    let result = await http.get('api/services/app/FileMasters/GetAllBuyerForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }
  public async getAllSupplierForLookupTable(pagedFilterAndSortedRequest: PagedFileMasterResultRequestDto): Promise<PagedResultDto<FileMasterSupplierLookupTableDto>>{
    let result = await http.get('api/services/app/FileMasters/GetAllSupplierForLookupTable', { params: pagedFilterAndSortedRequest });
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

export default new filemasterservices();

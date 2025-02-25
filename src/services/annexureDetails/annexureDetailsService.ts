import {CreateOrEditAnnexureDetailDto} from './dto/createOrEditAnnexureDetailDto';
import { EntityDto } from '../../services/dto/entityDto';
import { GetAnnexureDetailForViewDto } from './dto/getAnnexureDetailForViewDto';
import {GetAnnexureDetailForEditOutput} from './dto/getAnnexureDetailForEditOutput';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import {PagedAnnexureDetailResultRequestDto} from './dto/PagedAnnexureDetailResultRequestDto';
import {AnnexureDetailPartLookupTableDto} from './dto/annexureDetailPartLookupTableDto';
import {AnnexureDetailBuyerLookupTableDto} from './dto/annexureDetailsBuyerLookupTableDto';
import {AnnexureDetailSupplierLookupTableDto} from './dto/AnnexureDetailSupplierLookupTableDto';
import http from '../httpService';

class annexureDetailsService {
  public async create(createOrEditAnnexureDetailDto: CreateOrEditAnnexureDetailDto) {
    let result = await http.post('api/services/app/AnnexureDetails/CreateOrEdit', createOrEditAnnexureDetailDto);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete('api/services/app/AnnexureDetails/Delete', { params: entityDto });
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<GetAnnexureDetailForEditOutput> {
    let result = await http.get('api/services/app/AnnexureDetails/GetAnnexureDetailForEdit', { params: entityDto });
    return result.data.result;
  }

  public async getAll(pagedFilterAndSortedRequest: PagedAnnexureDetailResultRequestDto): Promise<PagedResultDto<GetAnnexureDetailForViewDto>> {
    let result = await http.get('api/services/app/AnnexureDetails/GetAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async update(createOrEditAnnexureDetailDto: CreateOrEditAnnexureDetailDto) {
    let result = await http.post('api/services/app/AnnexureDetails/CreateOrEdit', createOrEditAnnexureDetailDto);
    return result.data.result;
  }

  public async getAllPartForLookupTable(pagedFilterAndSortedRequest: PagedAnnexureDetailResultRequestDto): Promise<PagedResultDto<AnnexureDetailPartLookupTableDto>>{
    let result = await http.get('api/services/app/AnnexureDetails/GetAllPartForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async getAllBuyerForLookupTable(pagedFilterAndSortedRequest: PagedAnnexureDetailResultRequestDto): Promise<PagedResultDto<AnnexureDetailBuyerLookupTableDto>>{
    let result = await http.get('api/services/app/AnnexureDetails/GetAllBuyerForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }
  public async getAllSupplierForLookupTable(pagedFilterAndSortedRequest: PagedAnnexureDetailResultRequestDto): Promise<PagedResultDto<AnnexureDetailSupplierLookupTableDto>>{
    let result = await http.get('api/services/app/AnnexureDetails/GetAllSupplierForLookupTable', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }

  public async inportExceldata(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);  // Append the file to FormData

    // Sending the request with the FormData containing the file
    let result = await http.post('api/services/app/AnnexureDetails/ImportCBFCDataFromExcel', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'  // Ensure the Content-Type is set for file uploads
        }
    });

    return result.data.result;
  }
  public async GetSupplementarysplitAnnexureDetailsToExcel(supplementaryids: number[], TemplatePath: string) {
    try {
      //console.log("Input supplementaryids:", supplementaryids); // Log supplementaryids
      //console.log("Input TemplatePath:", TemplatePath); // Log TemplatePath
  
      if (!Array.isArray(supplementaryids) || typeof TemplatePath !== 'string') {
        throw new Error('Invalid input parameters');
      }
  
      // Create the query parameters
      const params = {
        supplementaryids: supplementaryids, // Pass the array as it is
        TemplatePath: TemplatePath,
      };
  
      const result = await http.get('api/services/app/AnnexureDetails/GetSupplementarysplitAnnexureDetailsToExcel', { params });
      
      return result.data.result;
    } catch (error) {
      console.error('Error fetching supplementary annexure details:', error);
      throw error;
    }
  }
  
}

export default new annexureDetailsService();

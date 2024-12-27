import { CreateOrEditPlantDto } from './dto/CreateOrEditPlantDto';
import { EntityDto } from '../../services/dto/entityDto';
//import { GetProcureDataForViewDto } from './dto/GetProcureDataForViewDto';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import { PagedPlantResultRequestDto } from "./dto/PagedPlantResultRequestDto";
//import { UpdateUserInput } from './dto/updateUserInput';
import http from '../httpService';
import { GetPlantForViewDto } from './dto/GetPlantForViewDto';
//import { promises } from 'dns';
//import { GetAllProcureDatasForExcelInput } from './dto/GetAllProcureDatasForExcelInput';


class PlantService {
  public async create(createOrEditPlantDto: CreateOrEditPlantDto) {
    let result = await http.post('api/services/app/Plants/CreateOrEdit', createOrEditPlantDto);
    return result.data.result;
  }

  public async update(updateplantInput: CreateOrEditPlantDto) {
    let result = await http.put('api/services/app/Plants/CreateOrEdit', updateplantInput);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete('api/services/app/Plants/Delete', { params: entityDto });
    return result.data;
  }

  // public async getRoles() {
  //   let result = await http.get('api/services/app/Role/GetRoles');
  //   return result.data.result.items;
  // }

 

  public async get(entityDto: EntityDto): Promise<CreateOrEditPlantDto> {
    let result = await http.get('api/services/app/Plants/GetPlantForEdit', { params: entityDto });
    return result.data.result;
  }

    public async getAll(pagedFilterAndSortedRequest: PagedPlantResultRequestDto): Promise<PagedResultDto<GetPlantForViewDto>> {
    let result = await http.get('api/services/app/Plants/GetAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }
//   public async getexceldata(){
//     let result = await http.get('api/services/app/ProcureDatas/GetProcureDatasToExcelReact');
//         return result.data.result;
//   }
//   public async inportExceldata(file: File): Promise<any> {
//     const formData = new FormData();
//     formData.append('file', file);  // Append the file to FormData

//     // Sending the request with the FormData containing the file
//     let result = await http.post('api/services/app/ProcureDatas/ImportGlobusDataFromExcel', formData, {
//         headers: {
//             'Content-Type': 'multipart/form-data'  // Ensure the Content-Type is set for file uploads
//         }
//     });

//     return result.data.result;
// }

}

export default new PlantService();

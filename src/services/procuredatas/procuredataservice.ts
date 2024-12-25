import { ChangeLanguagaInput } from './dto/changeLanguageInput';
import { CreateOrEditProcureDataDto } from './dto/CreateOrEditProcureDataDto';
import { EntityDto } from '../../services/dto/entityDto';
//import { GetProcureDataForViewDto } from './dto/GetProcureDataForViewDto';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import { PagedProcureResultRequestDto } from "./dto/PagedProcureResultRequestDto";
//import { UpdateUserInput } from './dto/updateUserInput';
import http from '../httpService';
import { GetProcureDataForViewDto } from './dto/GetProcureDataForViewDto';
//import { GetAllProcureDatasForExcelInput } from './dto/GetAllProcureDatasForExcelInput';


class ProcureService {
  public async create(createprocureInput: CreateOrEditProcureDataDto) {
    let result = await http.post('api/services/app/ProcureDatas/CreateOrEdit', createprocureInput);
    return result.data.result;
  }

  public async update(updateprocureInput: CreateOrEditProcureDataDto) {
    let result = await http.put('api/services/app/ProcureDatas/CreateOrEdit', updateprocureInput);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete('api/services/app/ProcureDatas/Delete', { params: entityDto });
    return result.data;
  }

  // public async getRoles() {
  //   let result = await http.get('api/services/app/Role/GetRoles');
  //   return result.data.result.items;
  // }

  public async changeLanguage(changeLanguageInput: ChangeLanguagaInput) {
    let result = await http.post('api/services/app/User/ChangeLanguage', changeLanguageInput);
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<CreateOrEditProcureDataDto> {
    let result = await http.get('api/services/app/ProcureDatas/GetProcureDataForEdit', { params: entityDto });
    return result.data.result;
  }

    public async getAll(pagedFilterAndSortedRequest: PagedProcureResultRequestDto): Promise<PagedResultDto<GetProcureDataForViewDto>> {
    let result = await http.get('api/services/app/ProcureDatas/GetAll', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }
  public async getexceldata(){
    let result = await http.get('api/services/app/ProcureDatas/GetProcureDatasToExcelReact');
        return result.data.result;
  }
}

export default new ProcureService();

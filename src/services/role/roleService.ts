import { CreateOrUpdateRoleInput } from './dto/createOrUpdateRoleInput';
import { CreateRoleOutput } from './dto/createRoleOutput';
import { EntityDto } from '../dto/entityDto';
import { GetAllRoleOutput } from './dto/getAllRoleOutput';
import { GetRoleAsyncInput } from './dto/getRoleAsyncInput';
import GetRoleAsyncOutput from './dto/getRoleAsyncOutput';
import { GetRoleForEditOutput } from './dto/getRoleForEditOutput';
import { PagedResultDto } from '../dto/pagedResultDto';
import { PagedRoleResultRequestDto } from './dto/PagedRoleResultRequestDto';
//import { UpdateRoleInput } from './dto/updateRoleInput';
import { UpdateRoleOutput } from './dto/updateRoleOutput';
import http from '../httpService';

class RoleService {

  public async create(createRoleInput: CreateOrUpdateRoleInput): Promise<PagedResultDto<CreateRoleOutput>> {
    let result = await http.post('api/services/app/Role/CreateOrUpdateRole', createRoleInput);

    return result.data.result;
  }

  public async getRolesAsync(getRoleAsyncInput: GetRoleAsyncInput): Promise<GetRoleAsyncOutput> {
    let result = await http.get('/api/services/app/Role/GetRolesAsync', { params: getRoleAsyncInput });
    return result.data.result;
  }



  public async update(updateRoleInput: CreateOrUpdateRoleInput): Promise<UpdateRoleOutput> {
    let result = await http.post('api/services/app/Role/CreateOrUpdateRole', updateRoleInput);

    return result.data.result as UpdateRoleOutput;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete('/api/services/app/Role/DeleteRole', { params: entityDto });
    return result.data;
  }

  public async getAllPermissions() {
    let result = await http.get('/api/services/app/Permission/GetAllPermissions');
    return result.data.result.items;
  }

  public async getRoleForEdit(entityDto: EntityDto): Promise<GetRoleForEditOutput> {
    let result = await http.get('/api/services/app/Role/GetRoleForEdit', { params: entityDto });
    return result.data.result;
  }

  public async get(entityDto: EntityDto) {
    let result = await http.get('/api/services/app/Role/Get', { params: entityDto });
    return result.data;
  }

  public async getAll(pagedFilterAndSortedRequest: PagedRoleResultRequestDto): Promise<PagedResultDto<GetAllRoleOutput>> {
    let result = await http.post('/api/services/app/Role/GetRoles', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }
}

export default new RoleService();

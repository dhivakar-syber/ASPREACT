import { action, observable, runInAction } from 'mobx';

import { CreateOrUpdateRoleInput } from '../services/role/dto/createOrUpdateRoleInput';
import { EntityDto } from '../services/dto/entityDto';
import { GetAllPermissionsOutput } from '../services/role/dto/getAllPermissionsOutput';
import { GetAllRoleOutput } from '../services/role/dto/getAllRoleOutput';
import { GetRoleAsyncInput } from '../services/role/dto/getRoleAsyncInput';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import RoleEditModel from '../models/Roles/roleEditModel';
//import { UpdateRoleInput } from '../services/role/dto/updateRoleInput';
import roleService from '../services/role/roleService';
import { PagedFilterAndSortedRequest } from '../services/dto/pagedFilterAndSortedRequest';

class RoleStore {
  @observable roles!: PagedResultDto<GetAllRoleOutput>;
  @observable roleEdit: RoleEditModel = new RoleEditModel();
  @observable allPermissions: GetAllPermissionsOutput[] = [];

  @action
  async create(createRoleInput: CreateOrUpdateRoleInput) {
    await roleService.create(createRoleInput);
  }

  @action
  async createRole() {
    this.roleEdit = {
      grantedPermissionNames: [],
      role: {
        name: '',
        displayName: '',
        description: '',
        id: 0,
      },
      permissions: [{ name: '', displayName: '', description: '' }],
    };
  }

  @action
  async getRolesAsync(getRoleAsyncInput: GetRoleAsyncInput) {
    await roleService.getRolesAsync(getRoleAsyncInput);
  }

  @action
  async update(updateRoleInput: CreateOrUpdateRoleInput) {
    if (!updateRoleInput || !updateRoleInput.role || !updateRoleInput.role.id) {
        console.error("Invalid updateRoleInput. Ensure it has the required properties.");
        return;
    }

    await roleService.update(updateRoleInput);

    this.roles.items = this.roles.items.map((x: GetAllRoleOutput) => {
        // Safely check if x.role and x.role.id exist
        if (x && x.id === updateRoleInput.role.id) {
            return { ...x, role: updateRoleInput.role }; // Update only the matching item
        }
        return x; // Keep other items unchanged
    });
}

  @action
  async delete(entityDto: EntityDto) {
    await roleService.delete(entityDto);
    this.roles.items = this.roles.items.filter((x: GetAllRoleOutput) => x.id !== entityDto.id);
  }

  @action
  async getAllPermissions(role:string) {
    var result = await roleService.getAllPermissions(role);
    // console.log(result.name);
    this.allPermissions = result;
  }
  @action
  async getRoleForEdit(entityDto: EntityDto,role: string) {
      let result = await roleService.getRoleForEdit(entityDto,role);
  
      //console.log("API Role Response:", result);
  
      runInAction(() => {
          this.roleEdit = {
              role: {
                  displayName: result.role.displayName || "",
                  name: result.role.displayName || "",
                  id: result.role.id || 0,
              },
              permissions: result.permissions || [],
              grantedPermissionNames: result.grantedPermissionNames || [],
          };
      });
  
      //console.log("Updated Store Role:", this.roleEdit);
  }
  

  @action
  async get(entityDto: EntityDto) {
    var result = await roleService.get(entityDto);
    this.roles = result.data.result;
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest,role:string) {
    let result = await roleService.getAll(pagedFilterAndSortedRequest,role);
    this.roles = result;
  }
}

export default RoleStore;

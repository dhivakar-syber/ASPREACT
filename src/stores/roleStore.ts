import { action, observable } from 'mobx';

import { CreateOrUpdateRoleInput } from '../services/role/dto/createOrUpdateRoleInput';
import { EntityDto } from '../services/dto/entityDto';
import { GetAllPermissionsOutput } from '../services/role/dto/getAllPermissionsOutput';
import { GetAllRoleOutput } from '../services/role/dto/getAllRoleOutput';
import { GetRoleAsyncInput } from '../services/role/dto/getRoleAsyncInput';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { PagedRoleResultRequestDto } from '../services/role/dto/PagedRoleResultRequestDto';
import RoleEditModel from '../models/Roles/roleEditModel';
//import { UpdateRoleInput } from '../services/role/dto/updateRoleInput';
import roleService from '../services/role/roleService';

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
    this.roles.items = this.roles.items.filter((x: GetAllRoleOutput) => x.role.id !== entityDto.id);
  }

  @action
  async getAllPermissions() {
    var result = await roleService.getAllPermissions();
    this.allPermissions = result;
  }

  @action
  async getRoleForEdit(entityDto: EntityDto) {
    let result = await roleService.getRoleForEdit(entityDto);
    this.roleEdit.grantedPermissionNames = result.grantedPermissionNames;
    this.roleEdit.permissions = result.permissions;
    //this.roleEdit.role.name = result.role;
  }

  @action
  async get(entityDto: EntityDto) {
    var result = await roleService.get(entityDto);
    this.roles = result.data.result;
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedRoleResultRequestDto) {
    let result = await roleService.getAll(pagedFilterAndSortedRequest);
    this.roles = result;
  }
}

export default RoleStore;

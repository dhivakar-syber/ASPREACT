import { action, observable } from 'mobx';

import { CreateOrUpdateUserInput } from '../services/user/dto/createOrUpdateUserInput';
//import { GetUserForEditOutput } from '../services/user/dto/getUserForEditOutput';
import { UserRoleDto } from '../services/user/dto/userRoleDto';
import { EntityDto } from '../services/dto/entityDto';
import { GetRoles } from '../services/user/dto/getRolesOuput';
import { GetUserOutput } from '../services/user/dto/getUserOutput';
import { PagedResultDto } from '../services/dto/pagedResultDto';
import { PagedUserResultRequestDto } from '../services/user/dto/PagedUserResultRequestDto';
//import { UpdateUserInput } from '../services/user/dto/updateUserInput';
import userService from '../services/user/userService';
import { EnumRoleType } from '../enum';

class UserStore {
  @observable users!: PagedResultDto<GetUserOutput>;
  @observable editUser!: CreateOrUpdateUserInput;
  @observable editRole!: UserRoleDto;
  @observable roles: GetRoles[] = [];

  @action
  async create(createUserInput: CreateOrUpdateUserInput) {
    let result = await userService.create(createUserInput);
    this.users.items.push(result);
  }

  @action
  async update(updateUserInput: CreateOrUpdateUserInput) {
    let result = await userService.update(updateUserInput);
    this.users.items = this.users.items.map((x: GetUserOutput) => {
      if (x.id === updateUserInput.id) x = result;
      return x;
    });
  }

  @action
  async delete(entityDto: EntityDto) {
    await userService.delete(entityDto);
    this.users.items = this.users.items.filter((x: GetUserOutput) => x.id !== entityDto.id);
  }

  @action
  async getRoles() {
    let result = await userService.getRoles();
    this.roles = result;
  }

  @action
  async get(entityDto: EntityDto,role:string) {
    let result = await userService.get(entityDto,role);
    this.editUser = result.user;
    this.editRole = result.roles;
  }

  @action
  async createUser() {
    this.editUser = {
      user: {
        id: 0,
        name: '',
        surname: '',
        userName: '',
        emailAddress: '',
        phoneNumber: '', // Optional field
        password: '', // Optional field (can be empty to indicate 'not change password')
        isActive: false,
        shouldChangePasswordOnNextLogin: false,
        isTwoFactorEnabled: false,
        isLockoutEnabled: false,
        vendorcode: '',
        roleType:EnumRoleType.NotPartOfOrganization
      },
      assignedRoleNames: [] as string[], // Default empty array
      sendActivationEmail: false,
      setRandomPassword: false,
      organizationUnits: [] as number[], // Default empty array
      id: 0, // Default value for id
    };
    
      this.editRole = {
        RoleId:0,
        RoleName:'',
        RoleDisplayName:'',
        IsAssigned:false,
        InheritedFromOrganizationUnit:false
      };
    this.roles = [];
  }

  @action
  async getAll(pagedFilterAndSortedRequest: PagedUserResultRequestDto) {
    let result = await userService.getAll(pagedFilterAndSortedRequest);
    this.users = result;
  }

  async changeLanguage(languageName: string) {
    await userService.changeLanguage({ languageName: languageName });
  }
}

export default UserStore;

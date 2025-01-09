import { ChangeLanguagaInput } from './dto/changeLanguageInput';
import { CreateOrUpdateUserInput } from './dto/createOrUpdateUserInput';
import { GetUserForEditOutput } from './dto/getUserForEditOutput';
import { EntityDto } from '../../services/dto/entityDto';
import { GetAllUserOutput } from './dto/getAllUserOutput';
import { PagedResultDto } from '../../services/dto/pagedResultDto';
import { PagedUserResultRequestDto } from "./dto/PagedUserResultRequestDto";
//import { UpdateUserInput } from './dto/updateUserInput';
import http from '../httpService';

class UserService {
  public async create(createUserInput: CreateOrUpdateUserInput) {
    let result = await http.post('api/services/app/User/CreateOrUpdateUser', createUserInput);
    return result.data.result;
  }

  public async update(updateUserInput: CreateOrUpdateUserInput) {
    let result = await http.post('api/services/app/User/CreateOrUpdateUser', updateUserInput);
    return result.data.result;
  }

  public async delete(entityDto: EntityDto) {
    let result = await http.delete('api/services/app/User/DeleteUser', { params: entityDto });
    return result.data;
  }

  public async getRoles() {
    try {
      const result = await http.post('api/services/app/Role/GetRoles', {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return result.data.result.items;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error; // Rethrow the error to handle it elsewhere if needed
    }
  }

  public async changeLanguage(changeLanguageInput: ChangeLanguagaInput) {
    let result = await http.post('api/services/app/User/ChangeLanguage', changeLanguageInput);
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<GetUserForEditOutput> {
    let result = await http.get('api/services/app/User/GetUserForEdit', { params: entityDto });
    return result.data.result;
  }

    public async getAll(pagedFilterAndSortedRequest: PagedUserResultRequestDto): Promise<PagedResultDto<GetAllUserOutput>> {
    let result = await http.post('api/services/app/User/GetUsers', { params: pagedFilterAndSortedRequest });
    return result.data.result;
  }
}

export default new UserService();

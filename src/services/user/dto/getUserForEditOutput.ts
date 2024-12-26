import {CreateOrUpdateUserInput} from './createOrUpdateUserInput'
import {UserRoleDto} from './userRoleDto'

export interface GetUserForEditOutput {
    user:CreateOrUpdateUserInput,
    roles:UserRoleDto,
}
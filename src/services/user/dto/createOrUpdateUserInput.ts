import {UserEditDto} from './userEditDto'

export interface CreateOrUpdateUserInput {
  user: UserEditDto; // UserEditDto from the previous definition
  assignedRoleNames: string[];
  sendActivationEmail: boolean;
  setRandomPassword: boolean;
  organizationUnits: number[];
  id:number;
}

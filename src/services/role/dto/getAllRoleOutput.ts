import {RoleEditDto} from "./roleEditDto"

export interface GetAllRoleOutput {
  role:RoleEditDto
  grantedPermissionNames: string[];
  id:number,
}

export interface UserRoleDto{
    RoleId:number,
    RoleName:string,
    RoleDisplayName:string,
    IsAssigned:boolean,
    InheritedFromOrganizationUnit:boolean
}
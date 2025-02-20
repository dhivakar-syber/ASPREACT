export interface GetAllPermissionsOutput {
    name: string;
    displayName: string;
    description: string;
    level:number;
    id: number;
    parentName:string;
    grantedPermissionNames:string[];
  }
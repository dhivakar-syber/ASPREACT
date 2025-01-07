export interface Role {
    //name: string;
    displayName: string;
    // description?: any;
    id: number;
    IsDefult:boolean;
  }
  
  export interface Permission {
    name: string;
    displayName: string;
    description?: any;
    ParentName:string;
    IsGrantedByDefault:boolean;
  }
  
  export interface GetRoleForEditOutput {
    role: Role;
    permissions: Permission[];
    grantedPermissionNames: string[];
  }
  
  
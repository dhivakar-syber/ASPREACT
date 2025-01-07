export interface GetAllRoleOutput {
    name: string;
    displayName: string;
    normalizedName: string;
    description: string;
    grantedPermissionsNames: string[];
    id: number;
  }
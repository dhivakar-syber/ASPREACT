export interface CreateRoleInput {
    name: string;
    displayName: string;
    normalizedName: string;
    description: string;
    grantedPermissionsNames: string[];
  }
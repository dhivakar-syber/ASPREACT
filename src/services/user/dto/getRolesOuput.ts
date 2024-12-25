export interface GetRoles {
  roleName: string;
  roleDisplayName: string;
  normalizedName: string;
  description: string;
  grantedPermissions: string[];
  roleId: number;
}

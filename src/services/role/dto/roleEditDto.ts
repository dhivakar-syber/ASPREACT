export interface RoleEditDto {
    id:number,
    displayName:string,
    isDefault:boolean,
    name: string;
    description?: any;
    normalizedName: string;
}
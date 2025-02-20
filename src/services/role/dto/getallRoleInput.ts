import { PagedRoleResultRequestDto } from "../../role/dto/PagedRoleResultRequestDto";

export interface GetallRoleInput extends PagedRoleResultRequestDto {
filter : string;
}
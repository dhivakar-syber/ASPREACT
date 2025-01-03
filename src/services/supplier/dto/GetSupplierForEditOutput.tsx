import { CreateOrEditSupplierDto } from "./CreateOrEditSupplierDto";

export interface GetSupplierForEditOutput{
    supplier:CreateOrEditSupplierDto;
    userName:string;
}
import { EnumDisputeStatus } from "../../../enum";
export interface CreateOrEditDisputeDto
{
    id:number;
    Query:string;
    BuyerRemarks:string;
    AccountsRemarks:string;
    Status:EnumDisputeStatus;
    ResponseTime:Date;
    SupplementarySummaryId:number;
    SupplierRejectionId:number;
    SupplierId:number;
    BuyerId:number;
    SupplierRejection:string;
    SupplierName:string;
    BuyerName:string;

}
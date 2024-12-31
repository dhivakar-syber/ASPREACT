import { EnumDisputeStatus } from "../../../enum";
export interface DisputeDto{
    id:number;
    Query:string;
    BuyerRemarks:string;
    AccountsRemarks: string;
    Status: EnumDisputeStatus;
    ResponseTime:Date;
    SupplementarySummaryId:Number;
    SupplierRejectionId:number;
    SupplierId:number;
    BuyerId:number;
}